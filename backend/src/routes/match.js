const Router = require('express').Router
const DeviceType = require('../db/models/DeviceType')


const matchRouter = Router()

matchRouter.get('/download', async (req, res) => {
  if (checkDevice(req.query)) {
    const file = `${__dirname}/../files/match/match.tar`
    res.download(file)
    return
  }
  res.status(400)
  res.send('No correct querys')
})

matchRouter.get('/config', async (req, res) => {
  if (checkDevice(req.query)) {
    const config = require(`${__dirname}/../files/match/config.json`)
    res.send(config)
    return
  }
  res.status(400)
  res.send('No correct querys')
})

async function checkDevice(querys) {
  const queryKeys = Object.keys(querys)
  if (queryKeys.includes('type') && queryKeys.includes('version')) {
    const deviceType = await DeviceType.findOne({name: querys.type})

    if (Object.keys(deviceType.version).includes(querys.version)) {
      return true
    }
    else {
      return false
    }
  }
}


module.exports = matchRouter
