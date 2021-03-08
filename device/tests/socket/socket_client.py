# -*- coding: utf-8 -*-
import os
import asyncore
import socket
import time
import logging
import json


path = os.path.dirname(os.path.realpath(__file__))


class Client(asyncore.dispatcher_with_send):
	def __init__(self, host, port, message, pk):
		self.logger = logging.getLogger("CLIENT")
		asyncore.dispatcher.__init__(self)
		self.create_socket(socket.AF_INET, socket.SOCK_STREAM)
		self.host = host
		self.port = port
		self.connect((host, port))
		self.out_buffer = message
		self.clientID = pk
		self.logger.debug("Connected %s" % str(self.clientID))

	def handle_close(self):
		self.close()

	def handle_read(self):
		rec_msg = self.recv(confjson.get("RATE", None))
		self.logger.debug("#%s, %s back at client %s" % (str(self.clientID), str(rec_msg), str(time.time())))
		self.close()


if __name__ == "__main__":
	logging.basicConfig(level=logging.DEBUG, format="%(name)s: %(message)s")

	with open(os.path.join(path, "config.json"), "r") as f:
		confjson = json.load(f)

	clients = []
	for idx in range(confjson.get("SOCKET_AMOUNT", None)):
		msg = "Start: %s" % str(time.time())
		clients.append(Client(
			confjson.get("HOST", None),
			confjson.get("PORT", None),
			msg,
			idx
		))
		start = time.time()
		logging.debug("Starting async loop for all connections, unix time %s" % str(start))
		asyncore.loop()
		logging.debug(str(time.time() - start))
