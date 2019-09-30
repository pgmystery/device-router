import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

PasswordInput.propTypes = {
  
}

PasswordInput.defaultProps = {
  
}

function PasswordInput({ onChange }) {
  const [password, setPassword] = useState('')

  useEffect(() => {
    onChange(password)
  }, [password])

  function passwordChanged(event) {
    const inputValue = event.currentTarget.value

    setPassword(inputValue)
  }

  return (
    <input
      type="password"
      name="password"
      value={password}
      onChange={passwordChanged}
    />)
}


export default PasswordInput
