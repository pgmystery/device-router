#!/usr/bin/env python
import os
import sys
from packages import shutil
import subprocess


class Setup:
	def __init__(self, update=False):
		self.path = os.path.dirname(os.path.abspath(__file__))
		# self.working_dir = os.getcwd()
		self.update_match = update
		if os.path.isdir("/etc/"):
			self.working_dir = "/etc"
			self.start()
		else:
			print("ERROR - Cannot found \"/etc/\"")

	def start(self):
		print("Start to roll-out match...")
		if self.update_match:
			self.update()
		else:
			self.install()
			self.start_match()

	def install(self):
		if os.path.isdir(self.path + "/match") and os.path.isfile(self.path + "/match.sh"):
			print("Move \"match\"-folder to \"/etc/\"...")
			# delete old-existing "match"-folder:
			print(self.working_dir + "/match")
			print(os.path.isdir(self.working_dir + "/match"))
			if os.path.isdir(self.working_dir + "/match"):
				print("Removing old-existing \"match\"-folder")
				shutil.rmtree(self.working_dir + "/match")
				# os.removedirs(self.working_dir + "/match")
				# os.rmdir(self.working_dir + "/match")
				print(os.path.isdir(self.working_dir + "/match"))
				# try:
				# 	shutil.rmtree(self.working_dir + "/match")
				# except:
				# 	print("ERROR!")
				# 	return False
			# move match folder and the match.sh file:
			try:
				# shutil.move(self.path + "/match", self.working_dir)
				shutil.copytree(self.path + "/match", self.working_dir + "/match")
			except OSError:
				print("Permission denied!")
				return False
			print("Set right owner for \"etc/match\"-folder")
			self.chown(self.working_dir + "/match", user="root", group="root")
			print("Set right rights for \"etc/match\"-folder")
			os.chmod(self.working_dir + "/match", 0755)
			for root, dirs, files in os.walk(self.working_dir + "/match/"):
				for momo in dirs:
					self.chown(os.path.join(root, momo), user="root", group="root")
					os.chmod(os.path.join(root, momo), 0755)
				for momo in files:
					self.chown(os.path.join(root, momo), user="root", group="root")
					os.chmod(os.path.join(root, momo), 0755)
				# Systemd: /etc/systemd/system/ (benutzerdefinierte) oder /lib/systemd/system/ (systemeigene)
				# Upstart: .conf - Dateien im Ordner /etc/init/
				# SysVinit: alle Dateien im Ordner /etc/init.d/
				# 	systemInitPaths = {
				# 		1: "/etc/init.d/",
				# 		2: "",
				# 	}
			# Create VirtualEnv:
			p = subprocess.Popen(["python", self.path + "/virtualenv/virtualenv.py", self.working_dir + "/match/virtualenv"], stdout=subprocess.PIPE)
			output, err = p.communicate()
			print(output)

			# Install requirements for virtualenv:
			print(self.working_dir + "/match/virtualenv/bin/pip install -r " + self.path + "/requirements.txt")
			p = subprocess.Popen(['sudo', self.working_dir + "/match/virtualenv/bin/pip", "install", "-r", self.path + "/requirements.txt"], stdout=subprocess.PIPE)
			output, err = p.communicate()
			print(output)

			# Get Python-Version in the VirtualEnv:
			# p = subprocess.Popen(["ls", self.working_dir + "/match/virtualenv/lib/"], stdout=subprocess.PIPE)
			# output, err = p.communicate()
			# python_version = str(output).replace("\n", "")
			# # Copy Packages to VirtualEnv -> site-packages:
			# for item in os.listdir(self.path + "/packages/"):
			# 	if not item == "__init__.py":
			# 		if os.path.isdir(self.path + "/packages/" + item):
			# 			shutil.copytree(self.path + "/packages/" + item, self.working_dir + "/match/virtualenv/lib/" + python_version + "/site-packages/" + item)
			# 		else:
			# 			shutil.copy(self.path + "/packages/" + item, self.working_dir + "/match/virtualenv/lib/" + python_version + "/site-packages/" + item)
			if os.path.isdir("/etc/init.d/"):
				print("Edit \"match.sh\"-file")
				with open(self.path + "/match.sh", "r+") as match_script_file:
					script_text = match_script_file.read()
					script_text = script_text.replace("[SCRIPT_DIR]", self.working_dir + "/match")
					match_script_file.seek(0)
					match_script_file.write(script_text)
					match_script_file.truncate()
				print("Move \"match.sh\"-file to \"/etc/init.d/\"")
				# delete old-existing "match.sh"-file:
				if os.path.isfile("/etc/init.d/match.sh"):
					try:
						os.remove("/etc/init.d/match.sh")
					except:
						print("ERROR!")
						return False
				try:
					# shutil.move(self.path + "/match.sh", "/etc/init.d/match.sh")
					shutil.copy(self.path + "/match.sh", "/etc/init.d/match.sh")
				except OSError:
					print("Permission denied!")
					return False
				print("Set rigth owner of \"/etc/init.d/match.sh\"-file")
				self.chown("/etc/init.d/match.sh", user="root", group="root")
				print("Set rigth rights of \"/etc/init.d/match.sh\"-file")
				os.chmod("/etc/init.d/match.sh", 0755)
				# run match.sh to start the app:
				# 	sudo update-rc.d match.sh defaults
				print("Set the \"/etc/init.d/match.sh\"-file in the boot-script")
				p = subprocess.Popen(["update-rc.d", "match.sh", "defaults"], stdout=subprocess.PIPE)
				output, err = p.communicate()
				print(output)
			else:
				print("ERROR - No init-path found on the system")
			# Copy lmatch-file to /usr/bin/:
			if os.path.isdir("/usr/bin/"):
				print("Copy lmatch-file to /usr/bin/")
				shutil.copy(self.path + "/bin/lmatch", "/usr/bin/lmatch")
				print("Set currect rights of \"/usr/bin/lmatch\"")
				os.chmod("/usr/bin/lmatch", 0755)
		else:
			print("ERROR - No \"match\" directory or the file \"match.sh\"")

	def update(self):
		if os.path.isfile(self.path + "/.update"):
			with open(self.path + "/.update", "r+") as f:
				text = f.read()
				if text == "3":
					f.seek(0)
					f.write("4")
					f.truncate()
			self.install()
			self.start_match()

	def start_match(self):
		print("START the \"/etc/init.d/match.sh\"-file")
		p = subprocess.Popen(["/etc/init.d/match.sh", "start"], stdout=subprocess.PIPE)
		output, err = p.communicate()
		print(output)
		for line in output.split("\n"):
			if line == "Starting system match daemon:process already running.":
				print("RESTART the \"/etc/init.d/match.sh\"-file")
				p = subprocess.Popen(["/etc/init.d/match.sh", "restart"], stdout=subprocess.PIPE)
				output, err = p.communicate()
				print(output)
		print("DONE!!!")

	def chown(self, path, user=None, group=None):
		"""Change owner user and group of the given path.
	
		user and group can be the uid/gid or the user/group names, and in that case,
		they are converted to their respective uid/gid.
		"""

		if user is None and group is None:
			raise ValueError("user and/or group must be set")

		_user = user
		_group = group

		# -1 means don't change it
		if user is None:
			_user = -1
		# user can either be an int (the uid) or a string (the system username)
		elif isinstance(user, basestring):
			_user = shutil._get_uid(user)
			if _user is None:
				raise LookupError("no such user: {!r}".format(user))

		if group is None:
			_group = -1
		elif not isinstance(group, int):
			_group = shutil._get_gid(group)
			if _group is None:
				raise LookupError("no such group: {!r}".format(group))

		os.chown(path, _user, _group)


if __name__ == "__main__":
	if len(sys.argv) >= 2:
		if sys.argv[1] == "update":
			setup = Setup(update=True)
		else:
			setup = Setup()
	else:
		setup = Setup()
