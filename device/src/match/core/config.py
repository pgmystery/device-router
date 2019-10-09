# -*- coding: utf-8 -*-

import os
import json
from utils import path


class Settings:
  def __init__(self, match):
    self.match = match
    self.path = path()
    self.settings = {}
    self.load_settings()

  def load_settings(self):
    if not os.path.isfile(self.path + "/config.json"):
      self.match.logger.log("No \"config.json\" file found!", "critical")
    else:
      try:
        self.settings = load_config(self.path + "/config.json")
      except:
        self.match.logger.log("Can't load the \"config.json\"-file!", "critical")

  def write_config(self):
    with open(self.path + "/config.json", 'wb') as configfile:
      json.dump(self.settings, configfile)
    self.load_settings()

  @staticmethod
  def get_setting_options(section, config=None):
    app_path = path()
    if not config:
      if not os.path.isfile(app_path + "/config.json"):
        return None
      else:
        try:
          config = load_config(app_path + "/config.json")
        except:
          return None
    if section:
      if section in config:
        return config[section]
      else:
        return None
    else:
      return None


def load_config(path):
  with open(path) as configfile:
    return json.load(configfile)
