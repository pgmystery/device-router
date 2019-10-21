import styled from 'styled-components/macro'
import MainTheme from '../Theme'


const Input = styled.input`
  width: 100%;
  height: 48px;
  font-size: 1em;
  border-bottom: 2px solid #e0e0e0;
  border-top: none;
  border-left: none;
  border-right: none;
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;

  :focus {
    border-bottom: 1px solid ${MainTheme.mainColor};
  }
`


export default Input
