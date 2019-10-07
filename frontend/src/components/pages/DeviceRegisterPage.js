import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Request from '../../utils/Request'
import Wrapper from '../utils/Wrapper'
import Button from '../utils/Button'
import DeviceRegisterList from './deviceRegisterList/DeviceRegisterList'
import DeviceRegisterHeader from './deviceRegisterList/DeviceRegisterHeader'

import Name from './deviceRegisterList/editFields/Name'
import Token from './deviceRegisterList/editFields/Token'
import StartDate from './deviceRegisterList/editFields/StartDate'
import EndDate from './deviceRegisterList/editFields/EndDate'


function DeviceRegisterPage() {
  const [registerTokenList, setRegisterTokenList] = useState()

  useEffect(() => {
    getRegisterTokenList().then(registerTokenList => setRegisterTokenList(registerTokenList))
  }, [])

  function getRegisterTokenList() {
    const request = new Request('/api/device/register')
    return request.get()
  }

  function updateRegisterToken(id, data) {
    const request = new Request('/api/device/register')
    request.patch({id, data})
      .then(updatedToken => getRegisterTokenList().then(registerTokenList => setRegisterTokenList(registerTokenList)))
  }

  function deleteRegisterToken(id) {
    const request = new Request('/api/device/register')
    request.delete({id})
      .then(deletedToken => getRegisterTokenList().then(registerTokenList => setRegisterTokenList(registerTokenList)))
  }

  function setListItems(listItems) {
    if (listItems.length > 0) {
      const newListItems = listItems.map(item => {
        return {
          name: <Name id={item._id} text={item.name} onChanged={updateRegisterToken}/>,
          token: <Token id={item._id} text={item.token} onRefresh={updateRegisterToken}/>,
          startDate: <StartDate id={item._id} text={item.startDate} onChanged={updateRegisterToken}/>,
          endDate: <EndDate id={item._id} text={item.endDate} onChanged={updateRegisterToken}/>,
          delete: () => deleteRegisterToken(item._id),
        }
      })
      return newListItems
    }
    return listItems
  }

  return (
    <Wrapper>
      <DeviceRegisterHeader refreshClick={getRegisterTokenList} />
      {
        registerTokenList && 
        <DeviceRegisterList headerItems={registerTokenList.keys} items={setListItems(registerTokenList.tokens)} />
      }
    </Wrapper>
  )
}

export const TextSpan = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
`

export const IconButton = styled(Button)`
  display: inline-flex;
  padding: 0;
  margin: 0 0 0 10px;
  min-height: 16px;
  min-width: 16px;
  border: 1px solid #c9c9ca;
`


export default DeviceRegisterPage
