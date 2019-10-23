import React, { useState, useEffect, useCallback } from "react"
import styled from 'styled-components/macro'
import useWindowSize from '../utils/hooks/useWindowSize'

import { Terminal } from "xterm"


function EShellTerm({ input, output, windowSizeChanged, fullscreen=false, className }) {
  const [term, setTerm] = useState(new Terminal())
  const [windowWidth, windowHeight] = useWindowSize()
  const [termAttachedToNode, setTermAttachedToNode] = useState(false)
  const [termWidthOffset, setTermWidthOffset] = useState(0)
  const [termHeightOffset, setTermHeightOffset] = useState(0)
  const [scrollbarWidth, setScrollbarWidth] = useState(15)

  const measuredRef = useCallback(node => {
    if (node) {
      if (!termAttachedToNode) {

        const termWidthOffset = window.innerWidth - node.offsetWidth + scrollbarWidth
        const termHeightOffset = window.innerHeight - node.offsetHeight
        setTermWidthOffset(termWidthOffset)
        setTermHeightOffset(termHeightOffset)

        term.open(node)

        const cols = Math.floor((window.innerWidth - termWidthOffset) / term._core.charMeasure.width)
        const rows = Math.floor((window.innerHeight - termHeightOffset) / term._core.charMeasure.height)

        term.resize(cols, rows)
        windowSizeChanged(cols, rows)

        setTermAttachedToNode(true)
      }
      else {

        let cols, rows
        if (fullscreen) {
          cols = Math.floor((window.innerWidth / term._core.charMeasure.width) - scrollbarWidth)
          rows = Math.floor(window.innerHeight / term._core.charMeasure.height)
        }
        else {
          cols = Math.floor((windowWidth - termWidthOffset) / term._core.charMeasure.width)
          rows = Math.floor((window.innerHeight - termHeightOffset) / term._core.charMeasure.height)
        }

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
    <TermWrapper className={className} fullscreen={fullscreen}>
      <TermContainer fullscreen={fullscreen} scrollbarWidth={scrollbarWidth} ref={measuredRef} />
    </TermWrapper>
  )
}

const TermWrapper = styled.div`
  background-color: ${({ fullscreen }) => fullscreen ? '#000000' : 'transparent'};
  margin: ${({ fullscreen }) => fullscreen ? '0 !important' : 0};
`

const TermContainer = styled.div`
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: ${({ fullscreen }) => fullscreen ? 'fixed' : 'static'};
`


export default EShellTerm
