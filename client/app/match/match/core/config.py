# -*- coding: utf-8 -*-

from ConfigParser import ConfigParser
import os


class Settings:
	def __init__(self, match):
		self.match = match
		self.config = ConfigParser()
		self.settings = {}
		self.load_settings()

	def load_settings(self):
		if not os.path.isfile(self.match.path + "/config.ini"):
			self.match.logger.log("No \"config.ini\" file found!", "critical")
		else:
			try:
				self.config.read(self.match.path + "/config.ini")
				self.settings = self.config._sections
			except:
				self.match.logger.log("Can't load the \"config.ini\"-file!", "critical")

	def get_sections(self):
		return self.config.sections()

	def get_options(self, section):
		if self.section_exist(section):
			return self.config._sections[section]
		else:
			return None

	def get_option(self, section, option):
		if self.option_exist(section, option):
			return self.config.get(section, option)
		else:
			return False

	def set_option(self, section, option, value):
		self.config.set(section, option, value)
		self.write_config()

	def delete_option(self, section, option):
		if self.option_exist(section, option):
			self.config.remove_option(section, option)
			self.write_config()
		else:
			return False

	def section_exist(self, section):
		if section in self.config.sections():
			return True
		else:
			return False

	def option_exist(self, section, get_option):
		options = self.config._sections[section]
		if options:
			for option in options:
				if option == get_option:
					return True
			return False
		else:
			return False

	def write_config(self):
		with open(self.match.path + "/config.ini", 'wb') as configfile:
			self.config.write(configfile)
		self.load_settings()

	@staticmethod
	def get_setting_options(path, section, config=None):
		if not config:
			config = ConfigParser()
			if not os.path.isfile(path + "/config.ini"):
				return None
			else:
				try:
					config.read(path + "/config.ini")
				except:
					return None
		if section:
			if section in config.sections():
				return config._sections[section]
			else:
				return None
		else:
			return None
