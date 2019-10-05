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
    <>
      <DeviceRegisterHeader refreshClick={refreshList} />
      <DeviceRegisterTable>
        {
          items.keys === undefined || <DeviceRegisterListHeadline items={items.keys} />
        }
        {
          items.tokens === undefined ||
            <tbody>
              {
                items.tokens.length > 0
                  ? items.tokens.map((tokenObject, index) => 
                      <DeviceRegisterListItem key={index} tokenObject={tokenObject} order={Object.keys(items.keys)}></DeviceRegisterListItem>
                    )
                  : <tr><DeviceRegisterTableErrorTd colSpan="100">You don't have any Register-Tokens :(</DeviceRegisterTableErrorTd></tr>
              }
            </tbody>
        }
      </DeviceRegisterTable>
    </>
  )
}

const DeviceRegisterTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  text-align: center;
`

const DeviceRegisterTableErrorTd = styled.td`
  color: #a6a6a6;
  font-size: 1.3em;
  padding: 20px;
`


export default DeviceRegisterList
