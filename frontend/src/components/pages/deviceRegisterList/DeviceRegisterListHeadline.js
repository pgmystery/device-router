import React from 'react'
import styled from 'styled-components'


function DeviceRegisterListHeadline({ items }) {
  return (
    <DeviceRegisterListHeadlineStyled>
      { items.map((item, index) => <DeviceRegisterListHeadlineItem key={index}>{item}</DeviceRegisterListHeadlineItem>) }
    </DeviceRegisterListHeadlineStyled>
  )
}

const DeviceRegisterListHeadlineStyled = styled.div`

`

const DeviceRegisterListHeadlineItem = styled.p`
  display: inline;
`


export default DeviceRegisterListHeadline
