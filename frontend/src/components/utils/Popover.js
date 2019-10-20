import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'


Popover.propTypes = {
  header: PropTypes.string,
  body: PropTypes.node,
}

Popover.defaultProps = {
  header: '(NO HEADER)',
  body: <p>(NO BODY)</p>,
}

function Popover({ body, header, className }) {
  return (
    <PopoverStyled className={className}>
      <PopoverArrowStyled></PopoverArrowStyled>
      { header && <PopoverHeader>{header}</PopoverHeader> }
      { body && <PopoverBody>{body}</PopoverBody> }
    </PopoverStyled>
  )
}

const PopoverStyled = styled.div`
  position: absolute;
  border: 1px solid #b5b0b0;
  border-radius: 5%;
  top: 40px;
  min-width: 250px;
`

const PopoverArrowStyled = styled.div`
  position: absolute;
  border: 6px solid #fff;
  border-top-color: rgb(0, 0, 0);
  border-right-color: rgb(0, 0, 0);
  border-left-color: rgb(0, 0, 0);
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  top: -12px;
  right: 8px;
`

const PopoverHeader = styled.h4`
  background-color: #e0e0e6;
  padding: .5rem .75rem;
  border-bottom: 1px solid #b5b0b0;
  border-top-left-radius: 5%;
  border-top-right-radius: 5%;
  margin: 0;
  font-size: .9em;
`

const PopoverBody = styled.div`
  background-color: #ffffff;
  border-bottom-left-radius: 5%;
  border-bottom-right-radius: 5%;
  padding: 10px;
  max-height: 70vh;
  overflow-y: auto;
`


export default Popover
