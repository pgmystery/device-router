import React from 'react'
import Request from '../../utils/Request'
import Wrapper from '../utils/Wrapper'

function DeviceRegisterList() {
  async function test() {
    const request = new Request('/api/device/register')

    const response = await request.get()

    console.log(response)
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
      <button onClick={test}>GET</button>
      <br></br>
      <br></br>
      <button onClick={test2}>POST</button>
    </Wrapper>
  )
}


export default DeviceRegisterList
