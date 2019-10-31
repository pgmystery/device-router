# -*- coding: utf-8 -*-
from threading import Thread
import time


class MatchDaemon(object):
  def __init__(self):
    self.running = True

  def start(self):
    self.running = True
    self.run()

  def stop(self):
    self.running = False

  def restart(self):
    self.stop()
    self.start()

  def run(self):
    print("STARTING INFINITY LOOP")
    """
    The Daemon-running function.
    """
    while self.running:
      time.sleep(1)


class SendOnline(Thread):
  def __init__(self, match):
    self.match = match
    Thread.__init__(self)
    self.daemon = True
    self.runnning = True
    self.offline = False

  def run(self):
    if self.match.access_token:
      while self.runnning:
        time.sleep(5)
        r = self.match.messenger.post(self.match.lighter_url + "/hardware/online/",
                                      {"access_token": self.match.access_token})
        if r.status_code != 200:
          if self.offline == False:
            self.offline = True
            self.match.logger.log("POST to \"" + r.url + "\" was NOT working: status_code: " + str(r.status_code),
                                  "error")
        else:
          if self.offline == True:
            self.offline = False
          self.match.analyser.analyse(r.json())
    else:
      return False
