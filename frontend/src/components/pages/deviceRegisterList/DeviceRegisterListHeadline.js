import React from 'react'
import styled from 'styled-components'


function DeviceRegisterListHeadline({ items }) {
  return (
    <DeviceRegisterListHeadlineStyled>
      {
        Object.keys(items).map((itemKey, index) => (
        <DeviceRegisterListHeadlineItem 
            keyName={itemKey}
            key={index}
          >{items[itemKey]}</DeviceRegisterListHeadlineItem>
        ))
      }
      <DeviceRegisterListHeadlineItem>Delete</DeviceRegisterListHeadlineItem>
    </DeviceRegisterListHeadlineStyled>
  )
}

const DeviceRegisterListHeadlineStyled = styled.div`
  display: contents;
  color: #919095;
`

const DeviceRegisterListHeadlineItem = styled.div`
  padding: .75rem;
  text-overflow: ellipsis;
  overflow: hidden;
  border-bottom: 2px solid #dee2e6;
`


export default DeviceRegisterListHeadline
