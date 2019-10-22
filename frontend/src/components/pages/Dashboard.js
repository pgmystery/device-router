import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { connect } from 'react-redux'
import ReactSVG from 'react-svg'

import request from '../../utils/Request'

import Wrapper from '../utils/Wrapper'
import P from '../utils/Paragraph'
import keyIcon from '../images/keyIcon.svg'
import downloadIcon from '../images/downloadIcon.svg'
import devicesConnectIcon from '../images/devicesConnectIcon.svg'
import flagIcon from '../images/flagIcon.svg'
import checkIcon from '../images/checkIcon.svg'
import LinkUnstyled from '../utils/LinkUnstyled'
import AnchorUnstyled from '../utils/AnchorUnstyled'
import rounectorFile from '../../files/rounector/Rounector.dmg'


const mapStateToProps = ({ session }) => ({
  session
})

function Dashboard({ session }) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    request.get({url: '/api/users/dashboard'})
      .then(data => {
        const { registerTokens, devices, connectedToDevice } = data

        if (registerTokens.length === 0 && devices.length === 0) {
          setCurrentStep(0)
        }
        else {
          if (devices.length === 0) {
            setCurrentStep(1)
          }
          else {
            setCurrentStep(2)
            if (connectedToDevice) {
              setCurrentStep(3)
            }
          }
        }
      })
      .catch(err => console.error(err))
  }, [])

  function getStatusIcon(step) {
      if (currentStep === step) {
        return getFlagIcon()
      }
      else if (currentStep > step) {
        return getCheckedIcon()
      }
  }

  function getCheckedIcon() {
    return (
      <StepBoxCheckedIcon>
        <ReactSVG src={checkIcon} beforeInjection={svg => {
          svg.setAttribute('style', 'width: 32px; height: 32px; fill: #28a745;')
        }} />
      </StepBoxCheckedIcon>
    )
  }

  function getFlagIcon() {
    return (
      <StepBoxFlagIcon>
        <ReactSVG src={flagIcon} beforeInjection={svg => {
          svg.setAttribute('style', 'width: 36px; height: 36px; fill: #00649f;')
        }} />
      </StepBoxFlagIcon>
    )
  }

  function getStepBox({ icon, step=0, arrowLeft=false, arrowRight=false }) {
    const done = (currentStep > step)

    return (
      <StepBox done={done}>
        { arrowLeft && <ArrowLeft done={done}/> }
        {
          getStatusIcon(step)
        }
        <ReactSVG src={icon} beforeInjection={svg => {
          svg.setAttribute('style', `width: 100px; height: 100px; fill: ${done ? '#28a745' : '#00649f'};`)
        }} />
        { arrowRight && <ArrowRight done={done}/> }
      </StepBox>
    )
  }

  return (
    <Wrapper>
      <H1Styled>How to start</H1Styled>
      <StepsWrapper>

        <StepWrapper>
            <StepBoxHeadline>1. Register-token</StepBoxHeadline>
          <LinkUnstyled to="/registerlist/new">
            { getStepBox({ icon: keyIcon, arrowRight: true}) }
          </LinkUnstyled>
          <PStyled>Create a Register-token</PStyled>
        </StepWrapper>

        <StepWrapper>
          <StepBoxHeadline>2. Install the APP</StepBoxHeadline>
          <AnchorUnstyled href={rounectorFile} download>
            { getStepBox({ icon: downloadIcon, step: 1, arrowLeft: true, arrowRight: true}) }
          </AnchorUnstyled>
          <PStyled>Download Rounector and connect your device to your profile</PStyled>
        </StepWrapper>

        <StepWrapper>
          <StepBoxHeadline>3. Connect to your device</StepBoxHeadline>
          <LinkUnstyled to="/eshell">
            { getStepBox({ icon: devicesConnectIcon, step: 2, arrowLeft: true}) }
          </LinkUnstyled>
            <PStyled>Connect to your device</PStyled>
        </StepWrapper>

      </StepsWrapper>
    </Wrapper>
  )
}

const H1Styled = styled.h1`
  letter-spacing: 0.8px;
`

const StepsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const StepWrapper = styled.div`
  width: calc(33.3333% - 10%);
`

const StepBox = styled.div`
  position: relative;
  border: 10px solid ${({ done }) => done ? '#28a745' : '#00649f'};
  padding: 50px;
  border-radius: 2%;
  text-align: center;
  cursor: pointer;

  :hover {
    background-color: #f0f0f0;
  }
`

const StepBoxFlagIcon = styled.div`
  position: absolute;
  top: -40px;
  right: 0px;
`

const StepBoxCheckedIcon = styled.div`
  position: absolute;
  top: 3px;
  right: 10px;
`

const Arrow = styled.div`
  position: absolute;
  top: 50%;

  ::before {
    content: "";
    border-color: transparent transparent transparent ${({ done }) => done ? '#28a745' : '#00649f'};
    border-width: 40px;
    position: absolute;
    border-style: solid;
    top: -40px;
    border-radius: 5px;
  }

  ::after {
    content: "";
    border-color: transparent transparent transparent #fff;
    border-width: 28px;
    position: absolute;
    border-style: solid;
    top: -28px;
  }
`

const ArrowRight = styled(Arrow)`
  right: 0;

  ${StepBox}:hover > & {
    ::after {
      border-color: transparent transparent transparent #f0f0f0;
    }
  }  
`

const ArrowLeft = styled(Arrow)`
  left: -10px;
`

const PStyled = styled(P)`
  margin: 20px 0;
  color: #a6a6a6;
`

const StepBoxHeadline = styled(PStyled)`
  color: #000000;
`


export default connect(
  mapStateToProps
)(Dashboard)
