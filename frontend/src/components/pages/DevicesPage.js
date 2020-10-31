import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import request from '../../utils/Request'
import Wrapper from '../utils/Wrapper'
import PageHeader from '../utils/PageHeader'
import Table, { TextSpan } from '../utils/table/Table'
import Input from '../utils/table/editFields/Input'
import Textarea from '../utils/table/editFields/Textarea'
import RefreshButton from '../utils/RefreshButton'
import { ButtonPrimary } from '../utils/Button'
import LinkUnstyled from '../utils/LinkUnstyled'


function DevicesPage() {
  const [devicesList, setDevicesList] = useState()

  useEffect(() => {
    refreshDeviceList()
  }, [])

  function getDeviceList() {
    return request.get({ url: '/api/device' })
  }

  function updateDevice(id, data) {
    request.patch({ url: '/api/device/', id, data })
      .then(updatedDevice => refreshDeviceList())
  }

  function refreshDeviceList() {
    getDeviceList()
      .then(deviceList => {
        deviceList.keys.connect = 'Connect'
        setDevicesList(deviceList)
      })
      .catch(err => console.error(err))
  }

  function getDevicesItems(devices) {
    if (devices && devices.length > 0) {
      return devices.map(device => {
        return {
          _id: device._id,
          name: <Input text={device.name} onChanged={newName => updateDevice(device._id, {name: newName})} />,
          type: <TextSpan>{device.type}</TextSpan>,
          version: <TextSpan>{device.version}</TextSpan>,
          description: <Textarea text={device.description} onChanged={newDescription => updateDevice(device._id, {description: newDescription})} />,
          online: device.online 
            ? <TextSpan color="green">Online</TextSpan>
            : <TextSpan color="red">Offline</TextSpan>,
          connect:
            <ConnectLink to={{
              pathname: "/eshell",
              device,
            }} >
              <ConnectButton disabled={!device.online}>Connect</ConnectButton>
            </ConnectLink>,
        }
      })
    }
    return devices
  }

  return (
    <Wrapper>
      <PageHeader rightComponent={
        <RefreshButton onClick={refreshDeviceList} />
      }/>
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

const ConnectButton = styled(ButtonPrimary)`
  margin: auto;
  width: 100%;
`

const ConnectLink = styled(LinkUnstyled)`
  margin: auto;
  width: 100%;
`


export default DevicesPage
