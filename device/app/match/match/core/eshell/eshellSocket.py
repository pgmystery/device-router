# -*- coding: utf-8 -*-
from ..connector.connector import SocketNamespace


class EShellSocket(SocketNamespace):
  def __init__(self, namespace, outputCallback=None):
    super(EShellSocket, self).__init__(namespace)
    self.outputCallback = outputCallback
    self.connectedCallback = None
    self.eshellSessionJoinedCallback = None

  def on_connect(self):
    if self.connectedCallback:
      self.connectedCallback()

  # def connect(self):
  # 	# self.client.v

  def on_start_eshell(self, userId):
    print(userId)

  # self.emit("start_eshell", "accept", userId)  # Need the new eshell socket.id as parameter

  def on_eshell_session_joined(self, sessionData):
    if self.eshellSessionJoinedCallback:
      self.eshellSessionJoinedCallback(sessionData)

  def on_cmd(self, data):
    self.outputCallback(data)

  def close(self):
    self.client.disconnect()
