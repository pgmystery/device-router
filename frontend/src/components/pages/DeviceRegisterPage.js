import React, { useState, useEffect } from 'react'
import Request from '../../utils/Request'
import Wrapper from '../utils/Wrapper'
import DeviceRegisterList from './deviceRegisterList/DeviceRegisterList'


function DeviceRegisterPage() {
  const [registerTokenList, setRegisterTokenList] = useState({})

  useEffect(() => {
    getRegisterTokenList().then(registerTokenList => setRegisterTokenList(registerTokenList))
  }, [])

  function getRegisterTokenList() {
    const request = new Request('/api/device/register')
    return request.get()
  }

  return (
    <Wrapper>
      <DeviceRegisterList items={registerTokenList} onRefresh={setRegisterTokenList} />
    </Wrapper>
  )
}


export default DeviceRegisterPage
