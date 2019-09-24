import React, { useEffect, useRef } from "react"
import { Terminal } from "xterm"


function EShellTerm({ input, output }) {
  // let termContainer = HTMLDivElement
  const termContainer = useRef(null)
  const term = new Terminal()

  useEffect(() => {
    term.open(termContainer)
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
    <div ref={termContainer} />
  )
}


export default EShellTerm
