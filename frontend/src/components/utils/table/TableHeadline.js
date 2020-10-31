import React from 'react'
import styled from 'styled-components'


function TableHeadline({ items, order }) {
  return (
    <TableHeadlineStyled>
      {
        order.map(itemKey => {
          if (itemKey !== "_id") {
            return (
              <TableHeadlineItem 
                keyName={itemKey}
                key={itemKey}
              >
                {items[itemKey]}
              </TableHeadlineItem>
            )
          }
        })
      }
    </TableHeadlineStyled>
  )
}

const TableHeadlineStyled = styled.div`
  display: contents;
  color: #919095;
`

const TableHeadlineItem = styled.div`
  padding: .75rem;
  text-overflow: ellipsis;
  overflow: hidden;
  border-bottom: 2px solid #dee2e6;
`


export default TableHeadline
