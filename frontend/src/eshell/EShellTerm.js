import React, { useState, useEffect, useCallback } from "react"
import styled from 'styled-components/macro'
import useWindowSize from '../utils/hooks/useWindowSize'

import { Terminal } from "xterm"
import { FitAddon } from 'xterm-addon-fit';


function EShellTerm({ input, output, windowSizeChanged, fullscreen=false, className }) {
  // const [fitAddon, setFitAddon] = useState(new FitAddon())
  const [term, setTerm] = useState(new Terminal())
  const [windowWidth, windowHeight] = useWindowSize()
  const [termAttachedToNode, setTermAttachedToNode] = useState(false)
  const [termWidthOffset, setTermWidthOffset] = useState(0)

  const measuredRef = useCallback(node => {
    if (node) {
      if (!termAttachedToNode) {
        // term.loadAddon(fitAddon)

        const termWidthOffset = window.innerWidth - node.offsetWidth
        setTermWidthOffset(termWidthOffset)

        term.open(node)

        const cols = Math.floor((window.innerWidth - termWidthOffset) / term._core.charMeasure.width)
        const rows = Math.floor(node.offsetHeight / term._core.charMeasure.height)

        term.resize(cols, rows)
        windowSizeChanged(cols, rows)

        // fitAddon.fit()
        setTermAttachedToNode(true)
      }
      else {
        const cols = Math.floor((windowWidth - termWidthOffset) / term._core.charMeasure.width)
        const rows = Math.floor(node.offsetHeight / term._core.charMeasure.height)

        term.resize(cols, rows)
        windowSizeChanged(cols, rows)
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
    <TermContainer className={className} fullscreen={fullscreen} ref={measuredRef} />
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
