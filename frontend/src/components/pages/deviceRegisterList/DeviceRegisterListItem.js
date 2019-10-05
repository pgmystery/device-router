import React from 'react'
import styled from 'styled-components'
import ReactSVG from 'react-svg'

import deleteIcon from '../../images/delete_icon.svg'
import { ButtonDanger } from '../../utils/Button'


function DeviceRegisterListItem({ tokenObject, order }) {
  return (
    <DeviceRegisterListItemStyled>
      {
        order.map((item, index) => <DeviceRegisterListItemText key={index}>{tokenObject[item]}</DeviceRegisterListItemText>)
      }
      <DeviceRegisterListItemText>
        <ButtonDelete>
          <ReactSVG src={deleteIcon} beforeInjection={svg => {
              svg.setAttribute('style', 'width: 24px; height: 24px; display: flex; fill: #ffffff;')
            }}
          />
        </ButtonDelete>
      </DeviceRegisterListItemText>
    </DeviceRegisterListItemStyled>
  )
}

const DeviceRegisterListItemStyled = styled.tr`
  padding: 0;
  width: 100%;

  :nth-of-type(2n+1) {
    background-color: #f4f2f3;
  }
`

const DeviceRegisterListItemText = styled.td`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 48px;
  padding: .75rem;
`

const ButtonDelete = styled(ButtonDanger)`
  margin: auto;
`


export default DeviceRegisterListItem
