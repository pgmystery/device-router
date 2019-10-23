frameSites[1] = 'device_finder'
frameFunctions['device_finder'] = () => {}

loadFrame('device_finder')


// LOAD HARDWARE LIST
const device_finder_comboBox_device_name = document.getElementById('device_finder_device')
const device_finder_comboBox_device_version = document.getElementById('device_finder_device_version')


let device_finder_devices
function setDevices() {
    console.log('START_GETTING_DEVICES')
    showLoadingScreen(true)
    fetch(rounector.url + '/api/device/type')
      .then(res => res.json())
      .then(data => {
        device_finder_devices = data
        data.forEach(device => addOptionItem(device_finder_comboBox_device_name, device.name))
        showLoadingScreen(false)
      })
      .catch(err => {
        console.error(err)
        dialog.showMessageBox(null, {
          type: 'error',
          title: 'Error!',
          message: 'Can not get the devices from server',
        },
        closeApp)
      })
}
rounector.afterUrlPromp.push(setDevices)

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
