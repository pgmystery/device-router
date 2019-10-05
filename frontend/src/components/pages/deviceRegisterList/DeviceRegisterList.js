import React from 'react'
import styled from 'styled-components'

import Request from '../../../utils/Request'

import DeviceRegisterHeader from './DeviceRegisterHeader'
import DeviceRegisterListHeadline from './DeviceRegisterListHeadline'
import DeviceRegisterListItem from './DeviceRegisterListItem'


function DeviceRegisterList({ items, onRefresh }) {
  function refreshList() {
    const request = new Request('/api/device/register')
    request.get()
      .then(res => onRefresh(res))
  }

  return (
    <DeviceRegisterStyled>
      <DeviceRegisterHeader refreshClick={refreshList} />
      <DeviceRegisterTable>
        {
          (items.tokens == undefined || items.keys == undefined) ||
          <>
            <DeviceRegisterListHeadline items={items.keys} />
            <DeviceRegisterListStyled>
              {items.tokens.map((tokenObject, index) => 
                <DeviceRegisterListItem key={index} tokenObject={tokenObject} order={Object.keys(items.keys)}></DeviceRegisterListItem>
              )}
            </DeviceRegisterListStyled>
          </>
        }
      </DeviceRegisterTable>
    </DeviceRegisterStyled>
  )
}

const DeviceRegisterStyled = styled.div`
`

const DeviceRegisterTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  text-align: center;
`

const DeviceRegisterListStyled = styled.tbody`
`


export default DeviceRegisterList
