import React, { useState, useEffect } from 'react'

import Request from '../../utils/Request'
import Wrapper from '../utils/Wrapper'
import Table, { TextSpan } from '../utils/table/Table'
import Input from '../utils/table/editFields/Input'
import Textarea from '../utils/table/editFields/Textarea'


function DevicesPage() {
  const [devicesList, setDevicesList] = useState()

  useEffect(() => {
    getDeviceList()
      .then(deviceList => setDevicesList(deviceList))
      .catch(err => console.error(err))
  }, [])

  function getDeviceList() {
    const request = new Request('/api/device')
    return request.get()
  }

  function updateDevice(id, data) {
    const request = new Request('/api/device')
    request.patch({ id, data })
      .then(updatedDevice => getDeviceList().then(deviceList => setDevicesList(deviceList)))
  }

  function getDevicesItems(devices) {
    if (devices && devices.length > 0) {
      return devices.map(device => {
        return {
          name: <Input text={device.name} onChanged={newName => updateDevice(device._id, {name: newName})} />,
          type: <TextSpan>{device.type}</TextSpan>,
          version: <TextSpan>{device.version}</TextSpan>,
          description: <Textarea text={device.description} onChanged={newDescription => updateDevice(device._id, {description: newDescription})} />,
          online: <TextSpan color={device.online ? "green" : "red"}>{device.online ? "Online" : "Offline"}</TextSpan>,
        }
      })
    }
    return devices
  }

  return (
    <Wrapper>
      {
        devicesList &&
          <Table
            headerItems={devicesList.keys}
            items={getDevicesItems(devicesList.devices)}
            noItemsText="You don't have any devices yet :("
          />
      }
    </Wrapper>
  )
}


export default DevicesPage
