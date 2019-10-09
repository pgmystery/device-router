# -*- coding: utf-8 -*-

import sys
import logging
import logging.handlers
import argparse

from config import Settings


class Logger:
  def __init__(self):
    self.LOG_FILENAME = "/var/log/match.log"
    self.LOG_LEVEL = logging.INFO
    self.LOGGING_FILE_TIME = "midnight"
    self.LOG_BACKUP_COUNTS = 3
    self.load_settings()
    # Define and parse command line arguments
    parser = argparse.ArgumentParser(description="MATCH-Python Service")
    parser_status_group = parser.add_mutually_exclusive_group()
    parser_status_group.add_argument("--start", "--run", help="start the MATCH-service", action="store_true")
    parser_status_group.add_argument("--stop", help="stop the MATCH-service", action="store_true")
    parser_status_group.add_argument("--restart", help="stop the MATCH-service", action="store_true")
    parser.add_argument("-l", "--log", help="file to write log to (default '" + self.LOG_FILENAME + "')")
    parser.add_argument("-v", "--version", help="shows the version from 'match'", action="store_true")
    # If the log file is specified on the command line then override the default
    args = parser.parse_args()
    if args.log:
      self.LOG_FILENAME = args.log
    # Configure logging to log to a file, making a new file at midnight and keeping the last 3 day's data
    # Give the logger a unique name (good practice)
    self.logger = logging.getLogger(__name__)
    # Set the log level to LOG_LEVEL
    self.logger.setLevel(self.LOG_LEVEL)
    # Make a handler that writes to a file, making a new file at midnight and keeping 3 backups
    handler = logging.handlers.TimedRotatingFileHandler(self.LOG_FILENAME, when=self.LOGGING_FILE_TIME,
                                                        backupCount=self.LOG_BACKUP_COUNTS)
    # Format each log message like this
    formatter = logging.Formatter('%(asctime)s %(levelname)-8s %(message)s')
    # Attach the formatter to the handler
    handler.setFormatter(formatter)
    # Attach the handler to the logger
    self.logger.addHandler(handler)
    self.stdout = Syslogger(self.logger, logging.INFO)
    sys.stdout = self.stdout
    self.stderr = Syslogger(self.logger, logging.ERROR)
    sys.stderr = self.stderr

  def load_settings(self):
    self.settings = Settings.get_setting_options("logger")
    if self.settings:
      # log_path:
      if "log_path" in self.settings:
        self.LOG_FILENAME = self.settings["log_path"]
      # log_level:
      if "log_level" in self.settings:
        if self.settings["log_level"] == "debug":
          self.LOG_LEVEL = logging.DEBUG
        elif self.settings["log_level"] == "info":
          self.LOG_LEVEL = logging.INFO
        elif self.settings["log_level"] == "warning":
          self.LOG_LEVEL = logging.WARNING
        elif self.settings["log_level"] == "error":
          self.LOG_LEVEL = logging.ERROR
        elif self.settings["log_level"] == "critical":
          self.LOG_LEVEL = logging.CRITICAL
      # logging_file_time:
      if "logging_file_time" in self.settings:
        self.LOGGING_FILE_TIME = self.settings["logging_file_time"]
      # backup_counts:
      if "backup_counts" in self.settings:
        self.LOG_BACKUP_COUNTS = int(self.settings["backup_counts"])

  def log(self, message, log_type="info"):
    if message:
      if log_type == "info":
        self.logger.info(message)
      elif log_type == "debug":
        self.logger.debug(message)
      elif log_type == "warning":
        self.logger.warning(message)
      elif log_type == "error":
        self.logger.error(message)
      elif log_type == "critical":
        self.logger.critical(message)


class Syslogger(object):
  def __init__(self, logger, level):
    self.logger = logger
    self.level = level

  def write(self, message):
    if message.rstrip() != "":
      self.logger.log(self.level, message.rstrip())
