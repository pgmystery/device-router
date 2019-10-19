import React, { useState, useEffect, useCallback } from "react"
import styled from 'styled-components/macro'
import useWindowSize from '../utils/hooks/useWindowSize'

import { Terminal } from "xterm"


function EShellTerm({ input, output, fullscreen=false }) {
  const [windowWidth, windowHeight] = useWindowSize()
  const [term, setTerm] = useState(new Terminal())
  const [termAttachedToNode, setTermAttachedToNode] = useState(false)

  const measuredRef = useCallback(node => {
    if (node) {
      if (!termAttachedToNode) {
        term.open(node)
        setTermAttachedToNode(true)
      }
      else {
        const rows = Math.floor(node.offsetHeight / term._core.charMeasure.height)
        const cols = Math.floor(node.offsetWidth / term._core.charMeasure.width)
        term.resize(cols, rows)
      }
    }
  })

  useEffect(() => {

    term.onData(outputData)

    input(inputData)
  }, [])

  function inputData(data) {
    term.write(data)
  }

  function outputData(data) {
    output(data)
  }

  return (
    <TermContainer fullscreen={fullscreen} ref={measuredRef} />
  )
}

const TermContainer = styled.div`
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgb(0, 0, 0);
  position: ${({ fullscreen }) => fullscreen ? 'fixed' : 'static'};
`


export default EShellTerm
