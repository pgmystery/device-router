frameSites[3] = 'rounection'
frameFunctions['rounection'] = startRounection

loadFrame('rounection')


const progressbarSteps = 6

const rounection_status = document.getElementById('rounection_status')
const rounection_progessBar = document.getElementById('rounection_progess')
const rounection_progessBarLabel = document.getElementById('rounection_progess_label')

let device_config

function startRounection() {
  const cancelButton = document.getElementById('rounection_cancel')

  cancelButton.addEventListener('click', () => {
    dialog.showMessageBox(null, {
      title: 'Cancelled the installation',
      message: 'Cancelled the installation',
    },
    () => {
      closeApp()
    })
  })

  getDeviceConfig()
    .then(configData => {
      device_config = configData
      device_config.info.description = rounector.data['device_info_description']
      device_config.info.type = rounector.data['device_type']
      device_config.info.version = rounector.data['device_version']
      device_config.auth.register_token = rounector.data['register_token']
      device_config.remote_host = rounector.url.replace('http://', '')

      writeFileSync(tempPath + '/config.json', JSON.stringify(device_config))

      cancel = rounection()
    })
}

let progress = 'start'
function setProgress(status, add=true) {
  rounection_status.textContent = status
  if (add) {
    rounection_progessBar.value = Number(rounection_progessBar.value) + 1
    const num = ((rounection_progessBar.value * 100)  / progressbarSteps)
    rounection_progessBarLabel.textContent = Math.round(num) + ' %'
  }
}

function rounection() {
  rounection_progessBar.max = progressbarSteps

  const host = {
    server: rounector.data['loginData'],
    commands: ['cd /tmp/', 'ls /tmp/match.tar'],
    onCommandComplete: function( command, response, sshObj ) {
      console.log('command', command)
      console.log('response', response)
      switch (progress) {
        case 'start':
          if(command === 'ls /tmp/match.tar') {
            connectToDevice(command, response.split('\r\n'), sshObj)
          }
          break
        case 'checkMatch2':
          checkMatch2(command, response.split('\r\n'), sshObj)
          break
        case 'downloadMatch':
          downloadMatch(command, response.split('\r\n'), sshObj)
          break
        case 'checkMatch':
          checkMatch(command, response.split('\r\n'), sshObj)
          break
        case 'unzipMatch':
          unzipMatch(command, response.split('\r\n'), sshObj)
          break
        case 'startMatch2':
          startMatch2(command, response.split('\r\n'), sshObj)
          break
        case 'cleanUp':
          cleanUp(command, response.split('\r\n'), sshObj)
          break
        case 'holdConnection':
          holdConnection(command, response.split('\r\n'), sshObj)
          break
      }
    },
  }

  setProgress('Connect to device...')

  rounector.connect(host)
}

// https://github.com/cmp-202/ssh2shell

function connectToDevice(command, response, sshObj) {
  let startDownload = true

  response.forEach(responseLine => {
    if (responseLine === '/tmp/match.tar') {
      setProgress('deleting old /tmp/match.tar', false)
      progress = 'checkMatch2'
      sshObj.commands.push('rm /tmp/match.tar')
      startDownload = false
    }
  })
  if (startDownload) {
    setProgress('downloading match-files...')
    progress = 'downloadMatch'
    sshObj.commands.push(`wget "${rounector.url}/api/match/download\x16?type=${rounector.data['device_type']}&version=${rounector.data['device_version'].replace(/\./g, '_')}" -O match.tar`)
    sshObj.commands.push('echo "download-done"')
  }
}

function checkMatch2(command, response, sshObj) {
  let startDownload = true

  if (command === 'rm /tmp/match.tar') {
    sshObj.commands.push('ls /tmp/match.tar')
    startDownload = false
    return
  }
  else if (command === 'ls /tmp/match.tar') {
    response.forEach(responseLine => {
      if (responseLine === '/tmp/match.tar') {
        progress = 'exit'
        setProgress('ERROR: Can\'t delete "/tmp/match.tar"', false)
        startDownload = false
        error('Can\'t delete "/tmp/match.tar"')
      }
    })
    if (startDownload) {
      setProgress('downloading match-files...')
      progress = 'downloadMatch'
      sshObj.commands.push(`wget "${rounector.url}/api/match/download\x16?type=${rounector.data['device_type']}&version=${rounector.data['device_version'].replace(/\./g, '_')}" -P /tmp/ -O match.tar`)
      sshObj.commands.push('echo "download-done"')
    }
  }
}

function downloadMatch(command, response, sshObj) {
  response.forEach(responseLine => {
    if (responseLine === 'download-done') {
      checkMatch(command, response, sshObj, { path: '/tmp/match.tar', callback: downloadMatch2})
    }
  })
}

function downloadMatch2(command, response, sshObj) {
  setProgress('unpacking the match-files...')
  progress = 'unzipMatch'
  sshObj.commands.push('tar xfv /tmp/match.tar -C /tmp/')
  sshObj.commands.push('echo "unzip-done"')
}

function unzipMatch(command, response, sshObj) {
  response.forEach(responseLine => {
    if (responseLine === 'unzip-done') {
      setProgress('downloading the config...')
      progress = 'startMatch'
      startHoldConnection(startMatch, sshObj)
      uploadFile(rounector.data['loginData'], tempPath + '/config.json', '/tmp/match/match/config.json', runStartMatch)
    }
  })
}

function runStartMatch() {
  holdConnectionExit = true
}

function startMatch(command, response, sshObj) {
  setProgress('start match...')
  progress = 'startMatch2'
  sshObj.commands.push('python /tmp/match/setup.py')
  sshObj.commands.push('echo "MATCH-DONE"')
}

function startMatch2(command, response, sshObj) {
  response.forEach(responseLine => {
    if (responseLine.toLowerCase().includes('permission denied')) {
      sshObj.commands.push('sudo python /tmp/match/setup.py')
      sshObj.commands.push('echo "MATCH-DONE"')
    }
    else if (responseLine === 'MATCH-DONE') {
      progress = 'cleanUp'
      setProgress('Finish installation...')
      sshObj.commands.push('rm /tmp/match.tar')
      sshObj.commands.push('rm -R /tmp/match')
      sshObj.commands.push('echo "CLEAN-UP-DONE"')
    }
  })
}

function cleanUp(command, response, sshObj) {
  response.forEach(responseLine => {
    if (responseLine === 'CLEAN-UP-DONE') {
      progress = 'done'
      flashWindow()
      dialog.showMessageBox(null, {
        title: 'Done',
        message: 'The installation was successfull!',
      },
      () => {
        closeApp()
      })
    }
  })
}


let checkMatchProgess, checkMatchPath, checkMatchCallback
function checkMatch(command, response, sshObj, { path, callback }={}) {
  if (progress !== 'checkMatch') {
    checkMatchProgess = progress
    checkMatchPath = path
    checkMatchCallback = callback
    progress = 'checkMatch'
    sshObj.commands.push('ls ' + path)
  }
  else {
    progress = checkMatchProgess
    let fileFound = false
    response.forEach(responseLine => {
      if (responseLine === checkMatchPath) {
        fileFound = true
        checkMatchCallback(command, response, sshObj)
      }
    })
    if (!fileFound) {
      error(`Can\'t find "${path}"`)
    }
  }
}

let holdConnectionExit, holdConnectionCallback, holdConnectionPromiseResolve, holdConnectionPromiseReject
function startHoldConnection(callback, sshObj) {
  holdConnectionExit = false
  holdConnectionCallback = callback
  return new Promise((resolve, reject) => {
    holdConnectionPromiseResolve = resolve
    holdConnectionPromiseReject = reject

    progress = 'holdConnection'
    holdConnection(undefined, undefined, sshObj)
  })
}

function holdConnection(command, response, sshObj) {
  if (!holdConnectionExit) {
    sshObj.commands.push('\x00')
  }
  else {
    holdConnectionCallback(command, response, sshObj)
  }
}


function uploadFile(loginData, file, path, callback) {
  const client = new SSHClient()
  client.on('ready', () => {
    client.sftp((err, sftp) => {
      if (err) throw err

      const readStream = createReadStream(file)
      const writeStream = sftp.createWriteStream(path)

      writeStream.on('close', () => {
        console.log( '- file transferred succesfully' )
        callback()
      })

      writeStream.on('end', () => {
        error('sftp connection closed')
      })

      readStream.pipe(writeStream)
    })
  }).connect(loginData)
}

function getDeviceConfig() {
  return fetch(rounector.url + `/api/match/config?type=${rounector.data['device_type']}&version=${rounector.data['device_version'].replace(/\./g, '_')}}`)
    .then(res => res.json())
}

function error(msg) {
  console.error(msg)
  dialog.showMessageBox(null, {
    type: 'error',
    title: 'Error!',
    message: msg,
  },
  () => {
    closeApp()
  })
}
