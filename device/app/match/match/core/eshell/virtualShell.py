# -*- coding: utf-8 -*-
import os
from threading import Thread
import subprocess
import sys
import select
import pty
import termios
import struct
import fcntl
import signal


# https://github.com/pexpect/ptyprocess

class VirtualShell(Thread):
  def __init__(self, output):
    print("VIRTUAL-SHELL - STARTING...")
    self.output = output
    Thread.__init__(self)
    self.message_filter = {
      "[WINDOW_RESIZE]": self.runWindowResize,
    }
    command = '/bin/bash'
    self.master_fd, self.slave_fd = pty.openpty()
    my_env = os.environ.copy()
    my_env["TERM"] = "xterm-color"
    my_env["COLUMNS"] = "80"
    my_env["LINES"] = "24"
    self.p = subprocess.Popen(
      command,
      preexec_fn=os.setsid,
      stdin=self.slave_fd,
      stdout=self.slave_fd,
      stderr=self.slave_fd,
      universal_newlines=True,
      env=my_env,
      shell=True,
    )

  def run(self):
    print("VIRTUAL-SHELL - RUN VIRTUAL-SHELL")
    while self.p.poll() is None:
      r, w, e = select.select([sys.stdin, self.master_fd], [], [])
      if self.master_fd in r:
        o = os.read(self.master_fd, 10240)
        if o:
          self.output(o)
    self.close()

  def send(self, message):
    if message == "exit":
      self.close()
      return
    if message[:len("[RESIZE]|")] == "[RESIZE]|" or message[:len("|[RESIZE]|")] == "|[RESIZE]|":
      message = message.split("|")
      self.setWindowSize(
        message[len(message) - 2], message[len(message) - 1])
      return
    os.write(self.master_fd, message)

  def runWindowResize(self, message):
    pass

  def setWindowSize(self, cols, rows):
    # Some very old platforms have a bug that causes the value for
    # termios.TIOCSWINSZ to be truncated. There was a hack here to work
    # around this, but it caused problems with newer platforms so has been
    # removed. For details see https://github.com/pexpect/pexpect/issues/39
    TIOCSWINSZ = getattr(termios, 'TIOCSWINSZ', -2146929561)
    try:
      s = struct.pack('HHHH', int(rows), int(cols), 0, 0)
      fcntl.ioctl(self.master_fd, TIOCSWINSZ, s)
    except:
      pass

  def close(self):
    try:
      os.killpg(os.getpgid(self.p.pid), signal.SIGTERM)
    except:
      pass
