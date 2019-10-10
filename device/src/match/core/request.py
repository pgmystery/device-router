# -*- coding: utf-8 -*-

import requests
import time
import json

from config import Settings


class Request:
  @staticmethod
  def get(url, params=None, **kwargs):
    ip = Settings.get_setting_options("remote_host")
    while True:
      try:
        return requests.get('http://' + ip + url, params, **kwargs)
      except:
        time.sleep(5)

  @staticmethod
  def post(url, data=None, json=None, **kwargs):
    ip = Settings.get_setting_options("remote_host")
    while True:
      try:
        return requests.post('http://' + ip + url, data, json, **kwargs)
      except:
        time.sleep(5)

  @staticmethod
  def patch(url, data=None, **kwargs):
    ip = Settings.get_setting_options("remote_host")
    while True:
      try:
        if not hasattr(kwargs, "headers"):
          kwargs["headers"] = {}
        kwargs["headers"]["Content-type"] = "application/json"
        data = json.dumps(data)
        return requests.patch('http://' + ip + url, data, **kwargs)
      except:
        time.sleep(5)
