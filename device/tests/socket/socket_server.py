# -*- coding: utf-8 -*-
import os
import asyncore
import socket
import time
import logging
import json


path = os.path.dirname(os.path.realpath(__file__))


class Server(asyncore.dispatcher):
	def __init__(self, host, port):
		self.logger = logging.getLogger("Server")
		asyncore.dispatcher.__init__(self)
		self.create_socket(socket.AF_INET, socket.SOCK_STREAM)
		self.set_reuse_addr()
		self.bind((host, port))
		self.listen(confjson.get("SERVER_QUEUE_SIZE", None))
		self.logger.debug("binding to %s" % str(self.socket.getsockname()))

	def handle_accept(self):
		socket, address = self.accept()
		self.logger.debug("new connection accepted")
		EchoHandler(socket)


class EchoHandler(asyncore.dispatcher_with_send):
	def handle_read(self):
		msg = self.recv(confjson.get("RATE", None))
		self.out_buffer = msg
		if self.out_buffer:
			self.out_buffer += " server recieve: %s" % time.time()
		else:
			self.close()


if __name__ == "__main__":
	logging.basicConfig(level=logging.DEBUG, format="%(name)s: %(message)s")

	with open(os.path.join(path, "config.json"), "r") as f:
		confjson = json.load(f)

	try:
		logging.debug("Server start")
		host = confjson.get("HOST", None)
		port = confjson.get("PORT", None)
		server = Server(host, port)
		asyncore.loop()
	except:
		logging.error(
			"Something happened,\n"
			"if it was not a keyboard break...\n"
			"check if adress taken, "
			"or another instance is running. Exit"
		)
	finally:
		logging.debug("Goodbye")
