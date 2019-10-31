import { backendUrl } from '../components/App'

class Request {

  static get({ url='', id='' }={}) {
    return this.send({
      url,
      id
    })
  }

  static post({ url='', data }) {
    return this.send({
      url,
      method: 'POST',
      data,
    })
  }

  static patch({ url='', id='', data }) {
    return this.send({
      url,
      method: 'PATCH',
      id,
      data,
    })
  }

  static delete({ url='', id='' }) {
    return this.send({
      url,
      method: 'DELETE',
      id,
    })
  }

  static send({ url='', method='GET', id='', data }={}) {
    return new Promise((resolve, reject) => {
      fetch(backendUrl + url + '/' + id, {
        method,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        if (res.ok) {
          resolve(res.json())
        }
        else {
          reject(res.json())
        }
      })
      .catch(res => reject(res.json()))
    })
  }
}

export default Request
