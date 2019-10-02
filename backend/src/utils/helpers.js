const parseError = err => {
  if (err.isJoi) return err.details[0]
  return JSON.stringify(err, Object.getOwnPropertyNames(err))
}

const sessionizeUser = user => ({
  id: user.id,
  username: user.username,
  picture: user.picture,
})

const sliceKeysFromObject = (obj, list) => ({
  ...Array.from(list).reduce((res, key) => ({ ...res, [key]: obj[key] }), { })
})

const getDaysBetweenDates = (first, second) => {
  const firstDateList = first.split('-')
  const firstDate = new Date(firstDateList[0], firstDateList[1]-1, firstDateList[2]);
  const secondDateList = second.split('-')
  const secondDate = new Date(secondDateList[0], secondDateList[1]-1, secondDateList[2]);
  return Math.round((secondDate-firstDate)/(1000*60*60*24))
}


module.exports = { parseError, sessionizeUser, sliceKeysFromObject, getDaysBetweenDates }
