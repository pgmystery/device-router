import React from 'react'
import styled from 'styled-components'
import ReactSVG from 'react-svg'

import deleteIcon from '../../images/delete_icon.svg'
import { ButtonDanger } from '../../utils/Button'


function DeviceRegisterListItem({ tokenObject, order }) {
  return (
    <DeviceRegisterListItemStyled>
      {
        order.map((item, index) => {
          return <DeviceRegisterListItemText key={index}>{tokenObject[item]}</DeviceRegisterListItemText>
        })
      }
      <DeviceRegisterListItemText>
        <ButtonDelete onClick={tokenObject.delete}>
          <ReactSVG src={deleteIcon} beforeInjection={svg => {
              svg.setAttribute('style', 'width: 24px; height: 24px; display: flex; fill: #ffffff;')
            }}
          />
        </ButtonDelete>
      </DeviceRegisterListItemText>
    </DeviceRegisterListItemStyled>
  )
}

const DeviceRegisterListItemStyled = styled.div`
  display: contents;
  padding: 0;
  width: 100%;

  :nth-child(odd) {
    > * {
      background-color: #f4f2f3;
    }
  }

  /* :hover {
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
    transform: scale(1);
  } */
`

const DeviceRegisterListItemText = styled.div`
  padding: .75rem;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;

  :hover {
    word-wrap: break-word;
    hyphens: auto;
  }
`

const ButtonDelete = styled(ButtonDanger)`
  margin: auto;
`


export default DeviceRegisterListItem
