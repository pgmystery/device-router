import { backendUrl } from '../components/App'


class Request {
  constructor(url) {
    this.url = url
  }

  get({ url=this.url, id='' }={}) {
    return this.send({
      url,
      id
    })
  }

  post({ url=this.url, data }) {
    return this.send({
      url,
      method: 'POST',
      data,
    })
  }

  patch({ url=this.url, id='', data }) {
    return this.send({
      url,
      method: 'PATCH',
      id,
      data,
    })
  }

  delete({ url=this.url, id='' }) {
    return this.send({
      url,
      method: 'DELETE',
      id,
    })
  }

  send({ url=this.url, method='GET', id='', data }={}) {
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

export default new Request()
