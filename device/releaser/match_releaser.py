# -*- coding: utf-8 -*-
from ConfigParser import ConfigParser
import os
import json
import tarfile
import shutil


# TODO:
# Better Version setting in the version_file/s


path = os.path.dirname(os.path.abspath(__file__))
settings = {}
pack_files = {}

def load_settings():
	global settings, pack_files
	configfile_path = os.path.normpath(path + "/config.ini")
	pack_files_path = os.path.normpath(path + "/pack_files.json")
	if os.path.isfile(configfile_path):
		config = ConfigParser()
		config.read(configfile_path)
		settings = config._sections
		if os.path.isfile(pack_files_path):
			with open(pack_files_path, "r") as pack_files_file:
				pack_files = json.load(pack_files_file)
		return True
	else:
		print("ERROR on loading the 'config.ini'-file!")
		return False


if __name__ == "__main__":
	# try:
		if load_settings():
			source_path = os.path.normpath(os.path.join(path, settings["settings"]["src_path"]))
			app_path = os.path.normpath(os.path.join(path, settings["settings"]["app_path"]))
			release_path = os.path.normpath(os.path.join(path, settings["settings"]["release_path"]))
			version_file_path = os.path.normpath(os.path.join(path, settings["settings"]["version_file_path"]))


			shutil.rmtree(app_path)
			os.makedirs(app_path)
			for item in os.listdir(source_path):
					s = os.path.join(source_path, item)
					d = os.path.join(app_path, item)
					if os.path.isdir(s):
							shutil.copytree(s, d)
					else:
							shutil.copy2(s, d)

			with open(os.path.normpath(app_path + "/match/" + "match.py"), "r") as match_file_dump:
				match_text = match_file_dump.read()
			match_version_find = match_text.find("__version__")
			match_version_find = match_text.find('"', match_version_find + len("__version__"))
			match_version_find2 = match_text.find('"', match_version_find + 1)
			match_version = match_text[match_version_find+1:match_version_find2]
			print("Current 'match' version: %s" % match_version)
			new_match_version = raw_input("Set the new version (%s): " % match_version)
			if len(new_match_version) > 0 and match_version != new_match_version:
				match_text = match_text[:match_version_find+1] + new_match_version + match_text[match_version_find2:]
				with open(os.path.normpath(app_path + "/match/" + "match.py"), "w") as match_file_dump:
					match_file_dump.write(match_text)

				with open(version_file_path, "r") as version_file_dump:
					version_file = json.load(version_file_dump)
				version_file["version"] = new_match_version
				with open(version_file_path, "w") as version_file_dump:
					json.dump(version_file, version_file_dump)

			with tarfile.open(os.path.normpath(path + "/match.tar"), "w") as tar:
				for subdir, dirs, files in os.walk(app_path):
					if len(files) > 0:
						for pack_file in pack_files.keys():
							pack_file_basename = os.path.basename(pack_file)
							dir_path = os.path.normpath(subdir[len(app_path):])
							pack_file_path = os.path.normpath(pack_file[:-len(pack_file_basename)])
							if dir_path == pack_file_path:
								if pack_file_basename == "*":
									for file in files:
										tar.add(os.path.normpath(app_path + "/" + dir_path + "/" + file), arcname=os.path.normpath("/match/" + pack_files[pack_file] + "/" + file))
									files = []
									break
								elif pack_file_basename in files:
									tar.add(os.path.normpath(app_path + "/" + dir_path + "/" + pack_file_basename), arcname=os.path.normpath("/match/" + pack_files[pack_file] + "/" + pack_file_basename))
									files.remove(pack_file_basename)
						if len(files) > 0:
							for file in files:
								tar.add(os.path.normpath(app_path + "/" + dir_path + "/" + file), arcname=os.path.normpath("/match/" + dir_path + "/" + file))
			shutil.move(os.path.normpath(path + "/match.tar"), os.path.normpath(release_path + "/match.tar"))
			print("DONE!")
		else:
			print("ERROR!")
	# except:
	# 	print("ERROR!")
