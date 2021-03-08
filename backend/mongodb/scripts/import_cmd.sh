#!/bin/sh

mongorestore -h mongo -d devicerouter /docker-entrypoint-initdb.d/mongodb
