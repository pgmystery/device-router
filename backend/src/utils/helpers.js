const parseError = err => {
  if (err.isJoi) return err.details[0]
  return JSON.stringify(err, Object.getOwnPropertyNames(err))
}

const sessionizeUser = user => {
  return { id: user.id, username: user.username }
}

const sliceKeysFromObject = (obj, list) => ({
  ...Array.from(list).reduce((res, key) => ({ ...res, [key]: obj[key] }), { })
})


module.exports = { parseError, sessionizeUser, sliceKeysFromObject }
