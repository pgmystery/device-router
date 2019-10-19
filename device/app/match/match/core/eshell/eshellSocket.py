# -*- coding: utf-8 -*-
from ..connector.connector import SocketNamespace


class EShellSocket(SocketNamespace):
  def __init__(self, namespace, outputCallback=None):
    super(EShellSocket, self).__init__(namespace)
    self.outputCallback = outputCallback
    self.connectedCallback = None
    self.disconnectedCallback = None
    self.eshellSessionJoinedCallback = None
    self.termSizeCallback = None

  def on_connect(self):
    if self.connectedCallback:
      self.connectedCallback()

  def on_disconnect(self):
    if self.disconnectedCallback:
      self.disconnectedCallback(self.client)

  def on_eshell_session_joined(self, sessionData):
    if self.eshellSessionJoinedCallback:
      self.eshellSessionJoinedCallback(sessionData)

  def on_cmd(self, data):
    self.outputCallback(data)

  def on_term_size(self, termSize):
    if self.termSizeCallback:
      self.termSizeCallback(termSize)

  def close(self):
    self.client.disconnect()
