import io from "socket.io-client"


function SocketIO({ url='http://127.0.0.1:3001', namespace='', query={} }={}) {
  return io(url + '/' + namespace, {query})
}


export default SocketIO
