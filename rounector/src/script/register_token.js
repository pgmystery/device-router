frameSites[0] = 'register_token'
frameFunctions['register_token'] = () => {}


loadFrame('register_token')
setActiveFrame('register_token')

document.getElementById('register_token_form').addEventListener('submit', e => {
  e.preventDefault()

  const formData = new FormData(document.getElementById('register_token_form'))
  register_token_data = Object.fromEntries(formData)
  rounector.data = {...rounector.data, ...register_token_data}

  loadFrameNext()
})
