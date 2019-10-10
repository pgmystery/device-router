import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'
import ReactSVG from 'react-svg'

import Request from '../../utils/Request'
import Wrapper from '../utils/Wrapper'
import Button, { ButtonDanger } from '../utils/Button'
import deleteIcon from '../images/delete_icon.svg'
import DeviceRegisterHeader from './deviceRegisterList/DeviceRegisterHeader'

import Table from '../utils/table/Table'
import Input from '../utils/table/editFields/Input'
import Token from '../utils/table/editFields/Token'
import Date from '../utils/table/editFields/Date'


function DeviceRegisterPage() {
  const [registerTokenList, setRegisterTokenList] = useState()

  useEffect(() => {
    refreshRegisterList()
  }, [])

  function refreshRegisterList() {
    getRegisterTokenList()
      .then(registerTokenList => {
        registerTokenList.keys.delete = 'Delete'
        setRegisterTokenList(registerTokenList)
      })
      .catch(err => console.error(err))
  }

  function getRegisterTokenList() {
    const request = new Request('/api/device/register')
    return request.get()
  }

  function updateRegisterToken(id, data) {
    const request = new Request('/api/device/register')
    request.patch({id, data})
      .then(updatedToken => refreshRegisterList())
  }

  function deleteRegisterToken(id) {
    const request = new Request('/api/device/register')
    request.delete({id})
      .then(deletedToken => refreshRegisterList())
  }

  function getListItems(listItems) {
    if (listItems.length > 0) {
      const newListItems = listItems.map(item => {
        return {
          name: <Input text={item.name} onChanged={newName => updateRegisterToken(item._id, {name: newName})}/>,
          token: <Token text={item.token} onRefresh={() => updateRegisterToken(item._id, {token: true})}/>,
          startDate: <Date text={item.startDate} name="startDate" onChanged={newDate => updateRegisterToken(item._id, {startDate: newDate})}/>,
          endDate: <Date text={item.endDate} name="endDate" onChanged={newDate => updateRegisterToken(item._id, {endDate: newDate})}/>,
          delete:
            <ButtonDelete onClick={() => deleteRegisterToken(item._id)}>
              <ReactSVG src={deleteIcon} beforeInjection={svg => {
                  svg.setAttribute('style', 'width: 24px; height: 24px; display: flex; fill: #ffffff;')
                }}
              />
            </ButtonDelete>,
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
        <Table
          headerItems={registerTokenList.keys}
          items={getListItems(registerTokenList.tokens)}
          noItemsText="You don't have any Register-Tokens :("
        />
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

const ButtonDelete = styled(ButtonDanger)`
  margin: auto;
`


export default DeviceRegisterPage
