frameSites[1] = 'device_finder'
frameFunctions['device_finder'] = () => {}

loadFrame('device_finder')


// LOAD HARDWARE LIST
const device_finder_comboBox_device_name = document.getElementById('device_finder_device')
const device_finder_comboBox_device_version = document.getElementById('device_finder_device_version')

async function getDevices() {
    return await fetch(rounector.url + '/api/device/type')
        .then(async res => await res.json())
}
let device_finder_devices
getDevices().then(data => {
    device_finder_devices = data
    data.forEach(device => addOptionItem(device_finder_comboBox_device_name, device.name))
})

const device_finder_form = document.getElementById('device_finder_form')
device_finder_form.addEventListener('submit', e => {
    e.preventDefault()

    device_finder_start()
        .then(e => {
            if (e) {
              loadFrameNext()
            }
        })
        .catch(e => {
            console.log('ERROR')
            console.log(e)
        })
})

document.getElementById('device_finder_back').addEventListener('click', () => {
    loadFrameBack()
})


// TODO:
device_finder_comboBox_device_name.addEventListener('change', () => {
    device_select_clear(device_finder_comboBox_device_version)
    if (device_finder_comboBox_device_name.selectedIndex > 0) {
        const device = device_finder_devices.find(device => {
            return device.name === device_finder_comboBox_device_name.options[device_finder_comboBox_device_name.selectedIndex].text
        })
        Object.keys(device.version)
            .forEach(version => addOptionItem(device_finder_comboBox_device_version, version.replace(/_/g, '.')))
        if (device_finder_comboBox_device_version.options.length > 1) {
            device_finder_comboBox_device_version.disabled = false
        }
    }
})

function device_select_clear(selectObject) {
  selectObject.innerHTML = ''
  addOptionItem(selectObject, 'Choose automatically...')
  selectObject.disabled = true
}

function addOptionItem(selectObject, text) {
  const itemDOM = document.createElement('option')
  itemDOM.text = text
  selectObject.add(itemDOM)
}

async function device_finder_start() {
  const selectedDevice = device_finder_comboBox_device_name.selectedIndex
  const selectedVersion = device_finder_comboBox_device_version.selectedIndex

  if (selectedDevice === 0) {
    rounector.data['device_type'] = device_finder_devices
    return true
  }
  else {
    rounector.data['device_type'] = device_finder_comboBox_device_name.options[device_finder_comboBox_device_name.selectedIndex].text
    const device = device_finder_devices.find(device => {
      return device.name === device_finder_comboBox_device_name.options[device_finder_comboBox_device_name.selectedIndex].text
    })
    if (selectedVersion === 0) {
      rounector.data['device_version'] = device.version
      return true
    }
    else {
      const version = device_finder_comboBox_device_version.options[device_finder_comboBox_device_version.selectedIndex].text.replace(/\./g, '_')
      rounector.data['device_version'] = {[version]: device.version[version]}
      return true
    }
  }
}

    // if (!device_finder_data) {
    //     requests.get(Rounector.url + '/api/1.0/rounector_hardware_list/', (r) => {
    //         let results = ''

    //         r.on('data', (chunk) => {
    //             results += chunk
    //         })

    //         r.on('end', () => {
    //             results = JSON.parse(results)

    //             results = results['results']
    //             for (let key in results) {
    //                 if (results.hasOwnProperty(key)) {
    //                     const result = results[key]
    //                     const resultKey = Object.keys(result)
    //                     if (resultKey.includes('type', 'name', 'version')) {
    //                         const type = decodeURIComponent(result['type'])
    //                         const name = decodeURIComponent(result['name'])
    //                         const version = decodeURIComponent(result['version'])
    //                         if (!device_finder_devices.hasOwnProperty(type)) {
    //                             device_finder_devices[type] = {}
    //                             addOptionItem(device_finder_comboBox_device_type, type)
    //                         }
    //                         if(!device_finder_devices[type].hasOwnProperty(name)) {
    //                             device_finder_devices[type][name] = []
    //                         }
    //                         if(!device_finder_devices[type][name].includes(version)) {
    //                             device_finder_devices[type][name].push(version)
    //                         }
    //                     }
    //                 }
    //             }

    //             device_finder_data = new FormData(document.getElementById('device_finder_form'))
    //         })
    //     }).on('error', (err) => {
    //         console.log('ERROR: ' + err.message)
    //     })
    // }

    // async function device_finder_start() {
    //     // TODO: setLoadingScreen(true)
    //     Rounector.data['device_type'] = null
    //     Rounector.data['device_name'] = null
    //     Rounector.data['device_version'] = null
    //     if (device_finder_comboBox_device_type.selectedIndex > 0) {
    //         Rounector.data['device_type'] = device_finder_comboBox_device_type.options[device_finder_comboBox_device_type.selectedIndex].text
    //     }
    //     if (device_finder_comboBox_device_name.selectedIndex > 0) {
    //         Rounector.data['device_name'] = device_finder_comboBox_device_name.options[device_finder_comboBox_device_name.selectedIndex].text
    //     }
    //     if (device_finder_comboBox_device_version.selectedIndex > 0) {
    //         Rounector.data['device_version'] = device_finder_comboBox_device_version.options[device_finder_comboBox_device_version.selectedIndex].text
    //     }

    //     const finder_url = Rounector.url + '/match/hardware/finder/?type=[DEVICE_TYPE]&name=[DEVICE_NAME]&version=[DEVICE_VERSION]'

    //     let result
    //     try {
    //         result = await send_request(Rounector.data['device_type'], Rounector.data['device_name'], Rounector.data['device_version'])
    //         console.log(result)
    //         // if (!Rounector.data['device_type']) {
    //         //     Rounector.data['device_type'] = result
    //         // }
    //         // else {
    //         //     if (!Rounector.data['device_name']) {
    //         //         Rounector.data['device_name'] = result
    //         //     }
    //         //     else {
    //         //         if (!Rounector.data['device_version']) {
    //         //             Rounector.data['device_version'] = result
    //         //         }
    //         //     }
    //         // }
    //         Rounector.data['device_type'] = result
    //         return result

    //         // else if (!Rounector.data['device_name']) {
    //         //     const devices_names = Object.keys(device_finder_devices[Rounector.data['device_type']])
    //         //     for (let i=0 i < devices_names.length i++) {
    //         //         result = await send_request(Rounector.data['device_type'], devices_names[i])
    //         //     }
    //         // }
    //         // else if (!Rounector.data['device_version']) {
    //         //     const devices_versions = Object.keys(device_finder_devices[Rounector.data['device_version']])
    //         //     for (let i=0 i < devices_versions.length i++) {
    //         //         result = await send_request(Rounector.data['device_type'], Rounector.data['device_name'], devices_versions[i])
    //         //     }
    //         // }
    //         // else {
    //         //
    //         // }
    //         // console.log(result)
    //         //
    //         // // const device_type = Object.keys(result)[0]  // TODO: NEED TO BE A LOOP LATER!!!
    //         // // // const device_names = Object.keys(result[device_type])
    //         // // console.log("TEST BEGIN")
    //         // // for (let device_name in result[device_type]) {
    //         // //     if (result[device_type].hasOwnProperty(device_name)) {
    //         // //         const device_infos = result[device_type][device_name]
    //         // //         if (device_infos['result'].length <= 0) {
    //         // //             reject(false)
    //         // //         }
    //         // //         else {
    //         // //             // TODO: NOT WORKING!
    //         // //             console.log(Rounector.data['device_type'])
    //         // //             if (!Rounector.data['device_type'].hasOwnProperty(device_infos['result']['protocol'])) {
    //         // //                 Rounector.data['device_type'][device_infos['result']['protocol']] = {}
    //         // //             }
    //         // //             if (!Rounector.data['device_type'][device_infos['result']['protocol']].hasOwnProperty(device_type)) {
    //         // //                 Rounector.data['device_type'][device_infos['result']['protocol']][device_type] = {}
    //         // //             }
    //         // //             Rounector.data['device_type'][device_infos['result']['protocol']][device_type][device_name] = {'commands': device_infos['result']['commands']}
    //         // //             if (device_infos['versions'].length > 0) {
    //         // //                 for (let device_version in device_infos['versions']) {
    //         // //                     if (device_infos['versions'].hasOwnProperty(device_version)) {
    //         // //                         Rounector.data['device_type'][device_infos['result']['protocol']][device_type][device_name][device_version] = device_infos['version'][device_version]
    //         // //                     }
    //         // //                 }
    //         // //             }
    //         // //         }
    //         // //     }
    //         // // }
    //         // // console.log(Rounector.data['device_type'])
    //         //
    //         // return result
    //     }
    //     catch (e) {
    //         console.log(e)
    //     }

    //     function send_request(type, name=null, version=null) {
    //         return new Promise((resolve, reject) => {
    //             let url = finder_url
    //             if (!type) {
    //                 url = url.replace('[DEVICE_TYPE]', 'all')
    //             }
    //             else {
    //                 url = url.replace('[DEVICE_TYPE]', type)
    //             }
    //             if (!name) {
    //                 url = url.replace('&name=[DEVICE_NAME]', '')
    //             }
    //             else {
    //                 url = url.replace('[DEVICE_NAME]', name)
    //             }
    //             if (!version) {
    //                 url = url.replace('&version=[DEVICE_VERSION]', '')
    //             }
    //             else {
    //                 url = url.replace('[DEVICE_VERSION]', version)
    //             }
    //             console.log(url)  // TODO: DELETE THIS LINE!
    //             try {
    //                 let result = ''
    //                 const req = requests.get(url, (r) => {
    //                     r.on('data', (chunk) => {
    //                         result += chunk
    //                     })

    //                     r.on('end', () => {
    //                         resolve(JSON.parse(result))
    //                     })

    //                     r.on('error', err => {
    //                         reject(err)
    //                     })
    //                 })
    //                 req.end()
    //             }
    //             catch (e) {
    //                 console.log(e)
    //                 reject(e)
    //             }
    //         })
    //     }
    // }

