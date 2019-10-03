import React from 'react'
import styled from 'styled-components'

import DeviceRegisterListHeadline from './DeviceRegisterListHeadline'
import DeviceRegisterListItem from './DeviceRegisterListItem'

function DeviceRegisterList({ items }) {
  console.log(items)

  return (
    <DeviceRegisterListStyled>
        {
          (items.tokens == undefined || items.keys == undefined) ||
          <>
            <DeviceRegisterListHeadline items={items.keys} />
            {items.tokens.map((tokenObject, index) => 
              <DeviceRegisterListItem key={index} tokenObject={tokenObject}></DeviceRegisterListItem>
            )}
          </>
        }
    </DeviceRegisterListStyled>
  )
}

const DeviceRegisterListStyled = styled.ul`

`


export default DeviceRegisterList
