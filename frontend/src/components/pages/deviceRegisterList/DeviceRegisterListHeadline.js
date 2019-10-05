import React, { useState } from 'react'
import styled from 'styled-components'


function DeviceRegisterListHeadline({ items }) {
  return (
    <DeviceRegisterListHeadlineStyled>
      <DeviceRegisterListHeadlineTr>
        {
          Object.keys(items).map((itemKey, index) => (
          <DeviceRegisterListHeadlineItem 
              keyName={itemKey}
              key={index}
            >{items[itemKey]}</DeviceRegisterListHeadlineItem>
          ))
        }
        <DeviceRegisterListHeadlineItem keyName='delete'>Delete</DeviceRegisterListHeadlineItem>
      </DeviceRegisterListHeadlineTr>
    </DeviceRegisterListHeadlineStyled>
  )
}

function DeviceRegisterListHeadlineItem({ keyName, children }) {
  const [key, setKey] = useState(keyName)
  return <DeviceRegisterListHeadlineItemStyled>{children}</DeviceRegisterListHeadlineItemStyled>
}

const DeviceRegisterListHeadlineStyled = styled.thead`
  padding: 0;
`

const DeviceRegisterListHeadlineTr = styled.tr`
  color: #919095;
  border-bottom: 2px solid #dee2e6;
`

const DeviceRegisterListHeadlineItemStyled = styled.th`
  padding: .75rem;
`


export default DeviceRegisterListHeadline
