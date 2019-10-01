import styled from 'styled-components/macro'
import MainTheme from '../../Theme'


const NavigationLinkStyled = styled.a`
  color: ${MainTheme.textColor};
  display: flex;
  align-items: center;
  text-decoration: none;
  letter-spacing: 0.8px;
  opacity: 0.8;

  :hover {
    text-decoration: underline;
    opacity: 1;
  }
`


export default NavigationLinkStyled
