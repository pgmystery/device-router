function dateConverter(date, filter='eu') {
  if (filter === 'eu') {
    const newDate = date.split('-')
    return newDate[2] + '.' + newDate[1] + '.' + newDate[0]
  }
  else if (filter === 'na') {
    const newDate = date.split('.')
    return newDate[2] + '-' + newDate[1] + '-' + newDate[0]
  }
}


export default dateConverter
