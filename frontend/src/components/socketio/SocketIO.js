import io from "socket.io-client"


function SocketIO({ url, namespace='', query={} }={}) {
  return io(url + '/' + namespace, {query})
}


export default SocketIO
