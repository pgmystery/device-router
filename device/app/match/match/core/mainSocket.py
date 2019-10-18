# -*- coding: utf-8 -*-
import json

from .connector.connector import SocketNamespace


class MainSocket(SocketNamespace):
  def __init__(self, match, namespace):
    self.match = match
    super(MainSocket, self).__init__(namespace)

  def on_connect(self):
    print('CONNECTED!!!')

  def on_disconnect(self):
    print('DISCONNECTED!!!')

  def on_start_eshell(self, data):
    print('STARTING ESHELL...')
    print(data)
    self.match.eshell.create_session({
      'userSocket': data['user'],
      'sessionId': data['id'],
    })
