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
`

const TableItemText = styled.div`
  padding: 1.75rem 1.25rem;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
`


export default TableItem
