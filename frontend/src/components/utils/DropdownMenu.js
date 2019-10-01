import React from 'react'
import styled from 'styled-components'


function DropdownMenu({ items }) {
  return (
    <>
      <DropdownMenuOverlay />
      <DropdownMenuStyled>
        { items.map((item, index) => <DropdownMenuItem key={index}>{item}</DropdownMenuItem>) }
      </DropdownMenuStyled>
    </>
  )
}

const DropdownMenuStyled = styled.ul`
  position: absolute;
  z-index: 1001;
  background: #ffffff;
  margin: 0;
  top: 53px;
  border: 1px solid#fbfbfc;
  border-radius: 2px;
  padding: 8px 0;
  padding-top: 8px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,.26);
  min-width: 96px;
  right: 10px;
`

const DropdownMenuItem = styled.li`
  list-style: none;

  > * {
    display: block;
    cursor: pointer;
    text-transform: capitalize;
    text-align: left;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: normal;
    text-decoration: none;
    color: #000000;

    :hover {
      background-color: #f7f8f9;
    }
  }
`

export const DropdownMenuSeparator = styled.span`
  border-bottom: 1px solid #e0e4e7;
  height: 1px;
  margin: 0 4px;
  padding: 0;
`

const DropdownMenuOverlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
`


export default DropdownMenu
