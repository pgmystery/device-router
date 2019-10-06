import React from 'react'
import styled from 'styled-components'

import DeviceRegisterListHeadline from './DeviceRegisterListHeadline'
import DeviceRegisterListItem from './DeviceRegisterListItem'


function DeviceRegisterList({ headerItems, items }) {
  return (
    <>
      <DeviceRegisterTable>
        {
          headerItems === undefined || <DeviceRegisterListHeadline items={headerItems} />
        }
        {
          items === undefined ||
            items.length > 0
              ? items.map((tokenObject, index) => 
                  <DeviceRegisterListItem key={index} tokenObject={tokenObject} order={Object.keys(headerItems)}></DeviceRegisterListItem>
                )
              : <DeviceRegisterTableError>You don't have any Register-Tokens :(</DeviceRegisterTableError>
        }
      </DeviceRegisterTable>
    </>
  )
}

const DeviceRegisterTable = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, auto);
`

const DeviceRegisterTableError = styled.div`
  color: #a6a6a6;
  font-size: 1.3em;
  padding: 20px;
  width: 100%;
  grid-column: 1/-1;
  text-align: center;
`


export default DeviceRegisterList
