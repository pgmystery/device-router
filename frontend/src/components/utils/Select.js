import React from 'react'
import styled from 'styled-components/macro'


function Select({ list=false, children }) {
  return (
    <SelectWrapper>
      <SelectStyled >
        {
          list
            ? children
            : children.map((item, index) => <Option key={index}>{item}</Option>)
        }
      </SelectStyled>
      <SelectArrow />
    </SelectWrapper>
  )
}

const SelectWrapper = styled.div`
  position: relative;
  margin-right: -10px;
`

const SelectStyled = styled.select`
  max-width: 200px;
  background-color: #fff;
  border-color: #d9d9d9 #ccc #b3b3b3;
  border-radius: 4px;
  border: 1px solid #ccc;
  color: #333;
  cursor: default;
  border-spacing: 0;
  border-collapse: separate;
  height: 36px;
  outline: none;
  overflow: hidden;
  position: relative;
  padding: 0 10px;
  min-width: 150px;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  text-overflow: ellipsis;

  :hover {
    box-shadow: 0 1px 0 rgba(0,0,0,.06);
  }

  ::-ms-expand {
    display: none;
  }
`

export const Option = styled.option`
  padding-right: 17px;
`

const SelectArrow = styled.span`
  border-color: #999 transparent transparent;
  border-style: solid;
  border-width: 5px 5px 2.5px;
  display: inline-block;
  height: 0;
  width: 0;
  position: relative;
  right: 20px;

  :hover {
    border-top-color: #666;
    cursor: pointer;
  }
`

export default Select
