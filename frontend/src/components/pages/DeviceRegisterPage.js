import React, { useState, useEffect } from 'react'
import Request from '../../utils/Request'
import Wrapper from '../utils/Wrapper'
import DeviceRegisterList from './deviceRegisterList/DeviceRegisterList'


function DeviceRegisterPage() {
  const [registerTokenList, setRegisterTokenList] = useState({})

  useEffect(() => {
    getRegisterTokenList().then(registerTokenList => setRegisterTokenList(registerTokenList))
  }, [])


  async function getRegisterTokenList() {
    const request = new Request('/api/device/register')
    const response = await request.get()
    return response
  }

  async function test2() {
    const request = new Request('/api/device/register')

    const response = await request.post({ data: {
      name: "VyOS",
      startDate: "2019-10-02",
      endDate: "2019-10-02"
    }})

    console.log(response)
  }

  return (
    <Wrapper>
      <DeviceRegisterList items={registerTokenList} onRefresh={setRegisterTokenList} />
    </Wrapper>
  )
}


export default DeviceRegisterPage
