import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'
import ReactSVG from 'react-svg'

import request from '../../utils/Request'
import Wrapper from '../utils/Wrapper'
import PageHeader from '../utils/PageHeader'
import Button, { ButtonDanger, ButtonPrimary, ButtonSuccess } from '../utils/Button'
import deleteIcon from '../images/delete_icon.svg'
import plusIcon from '../images/plus_icon.svg'
import downloadIcon from '../images/downloadIcon.svg'
import reloadIcon from '../images/reload_icon.svg'
import rounectorFile from '../../files/rounector/Rounector.dmg'
import LinkUnstyled from '../utils/LinkUnstyled'
import AnchorUnstyled from '../utils/AnchorUnstyled'

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
    return request.get({ url: '/api/device/register' })
  }

  function updateRegisterToken(id, data) {
    request.patch({ url: '/api/device/register', id, data })
      .then(updatedToken => refreshRegisterList())
  }

  function deleteRegisterToken(id) {
    const r = window.confirm('Do you really want to delete the token?')
    r && request.delete({ url: '/api/device/register', id })
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
            <ButtonDelete onClick={() => deleteRegisterToken(item._id)} tooltip={'Delete'}>
              <ReactSVG src={deleteIcon} beforeInjection={svg => {
                  svg.setAttribute('style', 'width: 16px; height: 16px; display: flex; fill: #ffffff;')
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
      <PageHeader leftComponent={
        <AnchorUnstyled href={rounectorFile} download>
          <ButtonPrimary>
            Download Rounector
            <ReactSVG src={downloadIcon} beforeInjection={svg => {
                svg.setAttribute('style', 'width: 24px; height: 24px; display: flex; fill: #ffffff; margin-left: 10px;')
              }}
            />
            </ButtonPrimary>
        </AnchorUnstyled>
      } rightComponent={
        <>
          <LinkUnstyled to='/registerlist/new' color={'#ffffff'}>
            <CreateRegisterTokenButton>
              Create Register-Token
              <ReactSVG src={plusIcon} beforeInjection={svg => {
                  svg.setAttribute('style', 'width: 24px; height: 24px; display: flex; fill: #ffffff; margin-left: 10px;')
                }}
              />
            </CreateRegisterTokenButton>
          </LinkUnstyled>
          <RefreshButton onClick={refreshRegisterList} tooltip={'Refresh'}>
            <ReactSVG src={reloadIcon} beforeInjection={svg => {
                svg.setAttribute('style', 'width: 26px; height: 26px; display: flex; fill: #000000;')
              }}
            />
          </RefreshButton>
        </>
      }/>
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
  min-height: 16px;
  min-width: 16px;
  border: 1px solid #c9c9ca;
`

const ButtonDelete = styled(ButtonDanger)`
  margin: auto;
`

const RefreshButton = styled(Button)`
  border-radius: 50%;
  padding: 6px;
  height: 38px;
`

const CreateRegisterTokenButton = styled(ButtonSuccess)`
  margin: 0;
`


export default DeviceRegisterPage
