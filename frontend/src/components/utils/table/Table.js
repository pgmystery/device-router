import React from 'react'
import styled from 'styled-components'

import Button from '../Button'
import TableHeadline from './TableHeadline'
import TableItem from './TableItem'


function Table({ headerItems, items, noItemsText }) {
  return (
    <TableStyled>
      {
        headerItems === undefined || <TableHeadline items={headerItems} />
      }
      {
        items === undefined ||
          items.length > 0
            ? items.map((itemComponents, index) => 
                <TableItem key={index} itemComponents={itemComponents} order={Object.keys(headerItems)}></TableItem>
              )
            : <TableNotItemsText>{noItemsText}</TableNotItemsText>
      }
    </TableStyled>
  )
}

const TableStyled = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, auto);
`

const TableNotItemsText = styled.div`
  color: #a6a6a6;
  font-size: 1.3em;
  padding: 20px;
  width: 100%;
  grid-column: 1/-1;
  text-align: center;
`

export const TextSpan = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
  color: ${({color}) => color};
`

export const IconButton = styled(Button)`
  display: inline-flex;
  padding: 0;
  margin: 0 0 0 10px;
  min-height: 16px;
  min-width: 16px;
  border: 1px solid #c9c9ca;
`


export default Table