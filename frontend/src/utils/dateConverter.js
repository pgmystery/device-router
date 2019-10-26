function dateConverter(date, filter='eu') {
  if (filter === 'eu') {
    const newDate = date.split('-')
    return newDate[2] + '.' + newDate[1] + '.' + newDate[0]
  }
  else if (filter === 'na') {
    const newDate = date.split('.')
    return newDate[2] + '-' + newDate[1].padStart(2, '0') + '-' + newDate[0].padStart(2, '0')
  }
}

export function dateConverterFromObject(date, filter='eu') {
  return dateConverter(
    date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0'),
    filter
  )
}


export default dateConverter
