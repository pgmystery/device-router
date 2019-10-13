# -*- coding: utf-8 -*-
import socketio


# import json
# try:
#     import thread
# except ImportError:
#     import _thread as thread
# import time


# https://python-socketio.readthedocs.io/en/latest/client.html

class Connector(object):
  def __init__(self, url, access_token):
    self.url = url
    self.access_token = access_token
    self.client = socketio.Client()
    self.client.connector = self

  def register_namespace(self, namespaceSocket):
    # self.client.register_namespace(SocketNamespace(namespace))
    self.client.register_namespace(namespaceSocket)
    return self.client.namespace_handlers[namespaceSocket.namespace]

  def connect(self, headers=None):
    if headers is None:
      headers = {
        "access_token": self.access_token,
      }
    print('START CONNECTION')
    self.client.connect(self.url, headers)


class SocketNamespace(socketio.ClientNamespace):
  def __init__(self, namespace):
    super(SocketNamespace, self).__init__()
    self.namespace = namespace
  # def on_connect(self):
  #     print('CONNECTED!!!')
  #     # self.client  # this is the main-socket!!!
  #     self.emit('login', self.client.connector.id)
  #
  # def on_disconnect(self):
  #     print('DISCONNECTED!!!')
  #
  # # def on_my_event(self, data):
  # #     self.emit('my_response', data)
  #
  # def on_msg(self, msg):
  #     print(msg)
  #
  # # def on_start_eshell(self, userId):
  # #     print(userId)
  # #     # self.emit("start_eshell", "accept", userId)  # Need the new eshell socket.id as parameter
