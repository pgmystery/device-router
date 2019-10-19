# -*- coding: utf-8 -*-
from threading import Thread

from ..config import Settings
from ..connector.connector import Connector
from .eshellSocket import EShellSocket
from .virtualShell import VirtualShell


class EShell(object):
  def __init__(self, url, mainSocketId):
    self.url = url
    self.mainSocketId = mainSocketId
    self.access_token = Settings.get_setting_options("auth")["access_token"]
    self.sessions = {}

  def create_session(self, session_data):
    sessionId = session_data['sessionId']
    self.sessions[sessionId] = EShellSession(self.url, sessionId, self.access_token)
    self.sessions[sessionId].socket.disconnectedCallback = self.remove_session

  def remove_session(self, socket):
      print("ESHELL - SOCKET DISCONNECTED!")
      if hasattr(socket, 'sessionId'):
        if (socket.sessionId in self.sessions):
            self.sessions[socket.sessionId].close()
            del self.sessions[socket.sessionId]
            print('ESHELL-SESSION STOPPED!')


class EShellSession(Thread):
  def __init__(self, url, sessionId, access_token):
    self.exit = False
    self.running = False
    self.virtual_shell = None

    self.sessionId = sessionId

    self.connector = Connector(url, access_token)
    self.socket = self.connector.register_namespace(EShellSocket('/eshell', self.on_cmd))
    self.socket.client.sessionId = sessionId
    self.socket.eshellSessionJoinedCallback = self.eshell_session_joined
    headers = {
      'type': 'device',
      'sessionid': str(sessionId),
      'accesstoken': str(access_token),
    }
    self.connector.connect(headers=headers)

    Thread.__init__(self)

  def eshell_session_joined(self, sessionData):
    print('ESHELL -> SESSION JOINED!!!')
    self.createVirtualShell()
    self.start_virtual_shell()
    self.socket.emit('rdy', self.sessionId)
    print("ESHELL - VIRTUAL-SHELL STARTET")

  def on_cmd(self, data):
    print('ON_CMD!!!')
    print(data)
    self.send_cmd(data['cmd'])

  def createVirtualShell(self):
    self.virtual_shell = VirtualShell(self.on_vs_message)
    print("ESHELL - CREATED VIRTUALSHELL")
    self.start()

  def run(self):
    while not self.exit:
      pass

  def start_virtual_shell(self):
    self.running = True
    self.virtual_shell.start()

  def send_cmd(self, cmd):
    if self.running:
      self.virtual_shell.send(cmd)

  def on_vs_message(self, output):
    msg = {
      'sessionId': self.sessionId,
      'msg': output,
    }
    if self.socket.client.connected:
      try:
        self.socket.emit('msg', msg)
      except:
        self.close()
    else:
      self.close()

  def close(self):
    if (self.virtual_shell):
      self.virtual_shell.close()
    self.exit = True
