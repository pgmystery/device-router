import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'
import ReactSVG from 'react-svg'

import request from '../../../utils/Request'

import Button from '../../utils/Button'
import Input from '../../utils/Input'
import removeIcon from '../../images/deleteIcon.svg'
import runRoundIcon from '../../images/runRoundIcon.svg'


function RunCommands({ sendCMD }) {
  const [commands, setCommands] = useState([])
  const [cmdInputValue, setCmdInputValue] = useState('')

  useEffect(() => {
    request.get({ url: '/api/users/cmds' })
      .then(({ cmds }) => setCommands(cmds))
  }, [])

  function handleClick() {
    addCMD(cmdInputValue)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      addCMD(cmdInputValue)
    }
  }

  function addCMD(cmd) {
    if (cmd) {
      const newCommands = [
        ...commands,
        cmd
      ]

      request.patch({ url: '/api/users/cmds', data: {cmds: newCommands} })

      setCommands(newCommands)

      setCmdInputValue('')
    }
  }

  function onDelete(index) {
    const newCommands = [
      ...commands.slice(0, index),
      ...commands.slice(index + 1),
    ]

    request.patch({ url: '/api/users/cmds', data: {cmds: newCommands} })

    setCommands(newCommands)
  }

  return (
    <RunCommandsStyled>
      <CommandsList>
        {
          commands.map((command, index) => <CommandsListItem key={index}>
            <CommandsListItemText>{ command }</CommandsListItemText>
            <CommandsListItemIcon>
              <ReactSVG
                src={runRoundIcon}
                onClick={() => sendCMD(command)}
                beforeInjection={svg => {
                  svg.setAttribute('style', 'width: 32px; height: 32px; fill: #00649f;')
                }}
              />
            </CommandsListItemIcon>
            <CommandsListItemIcon>
              <ReactSVG
                src={removeIcon}
                onClick={() => onDelete(index)}
                beforeInjection={svg => {
                  svg.setAttribute('style', 'width: 32px; height: 32px; fill: #e15e5ede;')
                }}
              />
            </CommandsListItemIcon>
          </CommandsListItem>)
        }
      </CommandsList>
      <InputWrapper>
        <InputStyled value={cmdInputValue} onChange={e => setCmdInputValue(e.target.value)} onKeyDown={handleKeyDown} />
        <ButtonStyled onClick={handleClick}>{'>'}</ButtonStyled>
      </InputWrapper>
    </RunCommandsStyled>
  )
}

const RunCommandsStyled = styled.div`
  width: 200px;
  border: 1px solid;
  padding: 10px;
  display: flex;
  flex-direction: column;
`

const CommandsList = styled.ul`
  width: 100%;
  flex-grow: 1;
  margin-top: 0;
  padding: 0;
  overflow-y: auto;
	list-style: none;
`

const CommandsListItem = styled.li`
  display: flex;
  justify-content: center;
  align-content: center;

  :hover {
    background-color: #f7f8f9;
  }
`

const CommandsListItemText = styled.p`
  flex: 5;
  text-align: center;
`

const CommandsListItemIcon = styled.div`
  flex: 1;
  margin: auto;
  cursor: pointer;
`

const InputWrapper = styled.div`
  display: flex;
`

const InputStyled = styled(Input)`
  font-size: 0.70em;
`

const ButtonStyled = styled(Button)`
  margin: 0;
`


export default RunCommands
