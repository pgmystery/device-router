import React from 'react'
import styled from 'styled-components'


function TableItem({ itemComponents, order }) {
  return (
    <TableItemStyled>
      {
        order.map(item => <TableItemText key={item}>{itemComponents[item]}</TableItemText>)
      }
    </TableItemStyled>
  )
}

const TableItemStyled = styled.div`
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

const TableItemText = styled.div`
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


export default TableItem