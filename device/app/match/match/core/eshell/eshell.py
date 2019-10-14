# -*- coding: utf-8 -*-
from threading import Thread

from ..config import Settings
from ..connector.connector import Connector
from .eshellSocket import EShellSocket
from .virtualShell import VirtualShell


# {
# 	"eshell": "start|
# 		{
# 			'sub_session': 1,
# 			'channel_name': 'daphne.response.iNLbihtBrF!',
# 			'hardware_id': u'531fb7b8-5850-4dc1-b278-6716813bc066',
# 			'session_key': 'd82b46eb-445e-41ad-9bd2-695198cd38cf',
# 			'user': 9
# 		}"
# }


class EShell(object):
  def __init__(self, url, mainSocketId):
    self.url = url
    self.mainSocketId = mainSocketId
    self.access_token = Settings.get_setting_options("auth")["access_token"]
    self.connector = Connector(url, self.access_token)
    self.eshellSocket = self.connector.register_namespace(EShellSocket('/eshell', self.on_cmd))
    self.eshellSocket.connectedCallback = self.on_socket_connect
    self.eshellSocket.eshellSessionJoinedCallback = self.eshell_session_joined
    # self.eshellSocket.outputCallback = self.on_socket_message
    # self.eshell_url = match.lighter_url + "/hardware/eshell/"
    self.sessions = {}
    # match.analyser.analyse_data["eshell"] = self.check_status

  # def check_status(self, status):
  #   status = status.split("|")
  #   if "start" == status[0]:
  #     self.create_session(status[1])
  #     return True

  def on_socket_connect(self):
    print("ESHELL - SOCKET CONNECTED!")

  def create_session(self, session_data):
    if not self.connector.client.connected:
      print(session_data)
      headers = {
        'type': 'device',
        'sessionid': str(session_data['sessionId']),
        # 'user': session_data['userSocket'],
        'accesstoken': str(self.connector.access_token),
      }
      self.connector.connect(headers=headers)

    # self.match.logger.log("ESHELL - CREATE ESHELL SESSION...")
    # user = session_data["user"]
    # access_token = session_data["access_token"]
    # self.sessions[sub_session] = EShellSession(self.match, user, access_token, channel_name, sub_session, session_key)
    # self.sessions[sub_session] = EShellSession(self.match, access_token, channel_name, sub_session, session_key)

  def eshell_session_joined(self, sessionData):
    print('ESHELL -> SESSION JOINED!!!')
    print(sessionData)
    sessionId = sessionData['id']
    # access_token = self.match.access_token
    self.sessions[sessionData['id']] = EShellSession(sessionId, self.eshellSocket)

  def on_cmd(self, data):
    print('ON_CMD!!!')
    print(data)
    self.sessions[data['sessionId']].send_cmd(data['cmd'])


class EShellSession(Thread):
  # def __init__(self, match, user, access_token, channel_name, sub_session, session_key):
  def __init__(self, sessionId, socket):
    self.exit = False
    self.running = False

    # self.user = user
    self.sessionId = sessionId
    self.socket = socket

    Thread.__init__(self)
    self.createVirtualShell()

  def createVirtualShell(self):
    # self.channel = None
    self.virtual_shell = VirtualShell(self.on_vs_message)
    print("ESHELL - CREATED VIRTUALSHELL")
    self.start()

  def run(self):
    # self.channel = self.client.get_transport().open_session()
    # self.channel = self.client.invoke_shell()
    # SENDING THE DATA TO CONNECT TO THE SESSION!
    # self.channel.send(str(data))
    # self.eshellSocket.emit('login', data)
    # while True:
    #     # start_string = self.channel.recv(1024)  # Standard: 1024 (1kb)
    #     start_string = self.ws.ws.recv()
    #     print("STARTING ESHELL BEGIN")
    #     print(start_string)
    #     print("STARTING ESHELL END")
    #     if start_string == "START_ESHELL_SESSION":
    #         break
    # self.virtual_shell.start()
    # while True:
    #     # command = self.channel.recv(10240)  # Standard: 1024 (1kb)
    #     # command = self.channel.recv(1024)  # Standard: 1024 (1kb)
    #     command = self.ws.on_message()
    #     if command == "exit":
    #         break
    #     if len(command) > 0:
    #         print("EShell_command: " + str(command))
    #     self.virtual_shell.send(command)
    # self.channel.close()
    self.start_virtual_shell()
    self.socket.emit('rdy', self.sessionId)
    print("ESHELL - VIRTUAL-SHELL STARTET")
    while not self.exit:
      pass

  def start_virtual_shell(self):
    self.running = True
    self.virtual_shell.start()

  def send_cmd(self, cmd):
    if self.running:
      self.virtual_shell.send(cmd)
      # self.socket.emit('msg', {
      #     'sessionId': self.sessionId,
      #     'msg': cmd,
      # })

  def on_socket_message(self, command):  # TODO: Need to be changed!
    print('ESHELL - ESHELL-SOCKET MSG: ' + command)
    # if not self.running and command == "start":
    #     self.start_virtual_shell()
    #     return
    # if len(command) > 0:
    #     if command == "exit":
    #         print("EShell_command: " + str(command))
    #         self.close()
    #         return
    # self.virtual_shell.send(command)

  def on_vs_message(self, output):
    msg = {
      'sessionId': self.sessionId,
      'msg': output,
    }
    self.socket.emit('msg', msg)

  def close(self):
    self.exit = True
