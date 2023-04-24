#!/bin/bash

echo "root:root" | chpasswd

# SSH:
echo "PermitRootLogin yes" >> /etc/ssh/sshd_config

service ssh start


# Python:
PYTHON_FILE_PATH=$(which python2.7)

PYTHON_DIR_PATH="$(dirname "${PYTHON_FILE_PATH}")"

NEW_PYTHON_FILE_PATH=${PYTHON_DIR_PATH}/python

ln -sf ${PYTHON_FILE_PATH} ${NEW_PYTHON_FILE_PATH}


# ENTRYPOINT:
/usr/sbin/sshd -D
bash
