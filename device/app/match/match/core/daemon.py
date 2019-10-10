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
    print("STARTING UNFINITY LOOP")
    """
    The Daemon-running function.
    """
    while self.running:
      time.sleep(1)
    # time.sleep(5)


class SendOnline(Thread):
  def __init__(self, match):
    self.match = match
    Thread.__init__(self)
    self.daemon = True
    self.runnning = True
    self.offline = False

  # self.start()

  def run(self):
    if self.match.access_token:
      while self.runnning:
        time.sleep(5)
        # try:
        # r = self.match.messenger.patch(self.match.lighter_url + self.match.messenger.hardware_url, data, auth=(self.match.messenger.username, self.match.messenger.password))
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
          # self.match.logger.log("PATCH to \"" + r.url + "\" was working: status_code: " + str(r.status_code) + "", "info")
          self.match.analyser.analyse(r.json())
      # except:
      # 	self.match.logger.log("ERROR on sending a PATCH for the time", "error")
    else:
      return False
