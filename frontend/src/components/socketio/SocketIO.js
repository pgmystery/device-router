import io from "socket.io-client"

import { backendUrl } from '../../App'


function SocketIO({ url=backendUrl, namespace='', query={} }={}) {
  return io(url + '/' + namespace, {query})
}


export default SocketIO
