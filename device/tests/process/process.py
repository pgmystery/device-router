#!/usr/bin/python
import subprocess
import time

# def start_subprocess():
print("START SUBPROCESS")

subprocess.Popen(["python", "/home/vyos/tests/process/side_process.py"])

print("SUBPROCESS STARTED")

time.sleep(10)

print("MAIN PROCESS DONE!")
