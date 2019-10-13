# -*- coding: utf-8 -*-

import sys

from core.daemon import MatchDaemon
from core.sys_logging import Logger
from core.config import Settings
from core.auth import Auth

from core.connector.connector import Connector
from core.mainSocket import MainSocket
from core.eshell.eshell import EShell

__version__ = "0.1"  # NEEDS TO HAVE IN "" CHARS!!!!


class Match(MatchDaemon):
  def __init__(self):
    super(Match, self).__init__()
    self.version = __version__

    # self.url = "http://127.0.0.1:3001"
    # self.url = "http://192.168.1.122:3001"  # HOME
    self.url = "http://172.16.100.38:3001"  # NEUE_FISCHE

    self.logger = Logger()
    self.logger.log("MATCH-Service startet")

    self.auth = Auth()
    if self.auth.check():
      self.settings = Settings(self)

      if (self.settings.settings["remote_host"] != ""):
        self.url = "http://" + self.settings.settings["remote_host"]

      self.connector = Connector(self.url, self.settings.settings["auth"]["access_token"])
      self.mainSocket = MainSocket(self, '/device')
      self.connector.register_namespace(self.mainSocket)
      self.connector.connect()
      self.eshell = EShell(self.url, self.mainSocket.client.sid)
    # while True:
    #     pass
    # print('END APP')


if __name__ == "__main__":
  match = Match()
  if len(sys.argv) >= 2:
    try:
      if sys.argv[1][0:len("--")] == "--":
        sys.argv[1] = sys.argv[1][len("--"):]
    except:
      pass
    if "start" == sys.argv[1] or "run" == sys.argv[1]:
      match.start()
    elif "stop" == sys.argv[1]:
      match.logger.log("stopping MATCH-service...")
      match.stop()
    elif "restart" == sys.argv[1]:
      match.logger.log("restarting MATCH-service...")
      match.restart()
    elif "version" == sys.argv[1] or "-v" == sys.argv[1]:
      print("MATCH v" + match.version)
    else:
      print("Unknown command")
      sys.exit(2)
    sys.exit(0)
  else:
    print("usage: %s --start/--run|--stop|--restart|--version" % sys.argv[0])
    sys.exit(2)
