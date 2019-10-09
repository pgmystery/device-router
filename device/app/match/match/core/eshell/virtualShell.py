# -*- coding: utf-8 -*-
import os
from threading import Thread
import ast
import subprocess
import sys
import select
import tty
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
    # save original tty setting then set it to raw mode
    # print("VIRTUAL-SHELL - ISATTY BEGIN")
    # print(os.isatty(sys.stdin))
    # print("VIRTUAL-SHELL - ISATTY END")
    # print("VIRTUAL-SHELL - STARTING... 11111")
    # self.old_tty = termios.tcgetattr(sys.stdin)  # NOT WORKING :( ERROR: 'Inappropriate ioctl for device'
    # print("VIRTUAL-SHELL - STARTING... 22222")
    # tty.setraw(sys.stdin.fileno())
    # print("VIRTUAL-SHELL - STARTING... 333333")
    # open pseudo-terminal to interact with subprocess
    self.master_fd, self.slave_fd = pty.openpty()
    # use os.setsid() make it run in a new process group, or bash job control will not be enabled
    # print("VIRTUAL-SHELL - STARTING SUBPROCESS...")
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
    )
    # print("PRINT P BEGIN")
    # print(self.p)
    # print("PRINT P END")

  def run(self):
    print("VIRTUAL-SHELL - RUN VIRTUAL-SHELL")
    while self.p.poll() is None:
      r, w, e = select.select([sys.stdin, self.master_fd], [], [])
      if self.master_fd in r:
        o = os.read(self.master_fd, 10240)
        if o:
          self.output(o)
    # restore tty settings back
    # termios.tcsetattr(sys.stdin, termios.TCSADRAIN, self.old_tty)
    self.close()

  def send(self, message):
    # print("SEND MESSAGE TO CHANNEL FROM ESHELL")
    # if message in self.message_filter.keys():
    #
    # else:
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
    print("VIRTUAL-SHELL - SET_WINDOW_SIZE")
    # Some very old platforms have a bug that causes the value for
    # termios.TIOCSWINSZ to be truncated. There was a hack here to work
    # around this, but it caused problems with newer platforms so has been
    # removed. For details see https://github.com/pexpect/pexpect/issues/39
    TIOCSWINSZ = getattr(termios, 'TIOCSWINSZ', -2146929561)
    # Note, assume ws_xpixel and ws_ypixel are zero.
    try:
      s = struct.pack('HHHH', int(rows), int(cols), 0, 0)
      fcntl.ioctl(self.master_fd, TIOCSWINSZ, s)
    except:
      pass

  def close(self):
    os.killpg(os.getpgid(self.p.pid), signal.SIGTERM)
