import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'
import ReactResizeDetector from 'react-resize-detector'

import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'


function EShellTerm({ input, output, onWindowSizeChanged, fullscreen=false, className }) {
  const [term, setTerm] = useState(null)
  const containerRef = useRef()
  const [fitAddon, setFitAddon] = useState(null)

  useEffect(() => {
    !term && setTerm(new Terminal())
    !fitAddon && setFitAddon(new FitAddon())
  }, [])

  useEffect(() => {
    if (term) {
      term.loadAddon(fitAddon)

      term.onData(outputData)  
      input(inputData)

      if (containerRef.current) {
        term.open(containerRef.current)
      }
    }
  }, [term, containerRef])

  useEffect(handleWrapperResize, [term, fitAddon, onWindowSizeChanged])

  function inputData(data) {
    term.write(data)
  }

  function outputData(data) {
    output(data)
  }

  function handleWrapperResize() {
    if (term && fitAddon) {
      fitAddon.fit()
      onWindowSizeChanged(term.cols, term.rows)
    }
  }

  return (
    <ReactResizeDetector handleWidth handleHeight>
      {
        ({ width, height }) => (
          <TermWrapper className={className} fullscreen={fullscreen}>
            <TermContainer fullscreen={fullscreen} ref={containerRef} style={{
              width: fullscreen ? '100%' : width && width.toString() + 'px',
              height: fullscreen ? '100%' : height && height.toString() + 'px',
            }}>
              <ReactResizeDetector onResize={handleWrapperResize}/>
            </TermContainer>
          </TermWrapper>
        )
      }
    </ReactResizeDetector>
  )
}

const TermWrapper = styled.div`
  background-color: ${({ fullscreen }) => fullscreen ? '#000000' : 'transparent'};
  margin: ${({ fullscreen }) => fullscreen ? '0 !important' : 0};
  height: 100%;
`

const TermContainer = styled.div`
  left: ${({ fullscreen }) => fullscreen ? 0 : 'auto'};
  right: ${({ fullscreen }) => fullscreen ? 0 : 'auto'};
  top: ${({ fullscreen }) => fullscreen ? 0 : 'auto'};
  bottom: ${({ fullscreen }) => fullscreen ? 0 : 'auto'};
  position: ${({ fullscreen }) => fullscreen ? 'fixed' : 'absolute'};
  z-index: 200;
  background-color: #000;
`


export default EShellTerm
