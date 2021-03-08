#!/usr/bin/python
import os


pidfile_path = "/var/run/match.pid"

pidfile = os.path.expanduser(pidfile_path)
try:
	with open(pidfile, "r") as f:
		pid = int(f.read())
	with open("/proc/%d/cmdline" % pid, "r") as f:
		cmdline = f.read().lower()
except:
	cmdline = ""


print(cmdline)

# https://stackoverflow.com/questions/42222425/python-sockets-multiple-messages-on-same-connection
