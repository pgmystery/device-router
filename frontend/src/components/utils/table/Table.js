import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Button from '../Button'
import TableHeadline from './TableHeadline'
import TableItem from './TableItem'


Table.propTypes = {
  headerItems: PropTypes.objectOf(PropTypes.string).isRequired,
  items: PropTypes.array.isRequired,
  noItemsText: PropTypes.string.isRequired
}

Table.defaultProps = {
  headerItems: {},
  items: [],
  noItemsText: 'NO ITEMS...'
}

function Table({ headerItems, items, noItemsText='No Items' }) {
  return (
    <TableStyled itemsCount={Object.keys(headerItems).length}>
      {
        (headerItems === undefined || items.length === 0) || <TableHeadline items={headerItems} order={Object.keys(items[0])} />
      }
      {
        items === undefined ||
          items.length > 0
            ? items.map(itemComponents => {
              const itemKey = itemComponents._id
              delete itemComponents._id
              return <TableItem key={itemKey} itemComponents={itemComponents} order={Object.keys(items[0])}></TableItem>
            }
              )
            : <TableNotItemsText>{noItemsText}</TableNotItemsText>
      }
    </TableStyled>
  )
}

const TableStyled = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: ${({ itemsCount }) => `repeat(${itemsCount}, auto)`};
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
  min-height: 32px;
  min-width: 32px;
  border: 1px solid #c9c9ca;
  padding: 0 11px;
  height: 32px;
  width: 32px;
`


export default Table
