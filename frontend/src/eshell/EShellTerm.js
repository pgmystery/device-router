import React, { useState, useEffect, useCallback } from "react"
import useWindowSize from '../utils/hooks/useWindowSize'

import { Terminal } from "xterm"


function EShellTerm({ input, output }) {
  const [windowWidth, windowHeight] = useWindowSize()
  const [term, setTerm] = useState(new Terminal())
  const [termAttachedToNode, setTermAttachedToNode] = useState(false)

  // https://www.dropbox.com/search/personal?path=%2F&preview=id%3ATdvMtGpBntAAAAAAAASnhA&query=eshell.js&search_session_id=79639764872554691998409907760409&search_token=9uCJS6B75Pj6VIETXg7iYMZRjXgpGEMU9wFxzeivwsI%3D

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
    <div ref={measuredRef} />
  )
}

export default EShellTerm
