# -*- coding: utf-8 -*-
import socketio


# https://python-socketio.readthedocs.io/en/latest/client.html

class Connector(object):
  def __init__(self, url, access_token):
    self.url = url
    self.access_token = access_token
    self.client = socketio.Client()
    self.client.connector = self

  def register_namespace(self, namespaceSocket):
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
