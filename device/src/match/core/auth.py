# -*- coding: utf-8 -*-

from utils import path
from config import Settings
from request import Request


class Auth():
  def __init__(self):
    self.path = path()
    self.auth_settings = Settings.get_setting_options("auth")
    self.info_settings = Settings.get_setting_options("info")

  def check(self):
    if "register_token" in self.auth_settings:
      if len(self.auth_settings["register_token"]) > 0:

        data = {
          "registerToken": self.auth_settings["register_token"],
          "description": self.info_settings["description"],
          "type": self.info_settings["type"],
          "version": self.info_settings["version"],
        }

        response = Request.post('/api/device/auth', data)

        print("REQUEST_RESPONSE_BEGIN")
        print(response.json())
        print("REQUEST_RESPONSE_AFTER")

        return False
    return False
