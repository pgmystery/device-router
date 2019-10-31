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
      <PopoverFooter />
    </PopoverStyled>
  )
}

const PopoverStyled = styled.div`
  z-index: 10;
  position: absolute;
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
  background-color: #ffffff;
  padding: .5rem .75rem;
  border: 1px solid #b5b0b0;
  margin: 0;
  font-size: .9em;
  border-top-left-radius: 4%;
  border-top-right-radius: 4%;
`

const PopoverBody = styled.div`
  background-color: #ffffff;
  max-height: 70vh;
  overflow-y: auto;
  border-top: 1px solid #b5b0b0;
  border-left: 1px solid #b5b0b0;
  border-right: 1px solid #b5b0b0;
  
  > {
    margin: 20px 0;
  }

  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }
`

const PopoverFooter = styled.div`
  height: 2px;
  background-color: #ffffff;
  border-bottom-left-radius: 100%;
  border-bottom-right-radius: 100%;
  border-left: 1px solid #b5b0b0;
  border-right: 1px solid #b5b0b0;
  border-bottom: 1px solid #b5b0b0;
`


export default Popover
