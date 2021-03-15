FROM ubuntu:latest

RUN apt-get -y update && apt-get -y upgrade

RUN apt-get -y install curl

RUN apt-get -y install python2.7

RUN curl https://bootstrap.pypa.io/pip/2.7/get-pip.py -o /tmp/get-pip.py

RUN python2.7 /tmp/get-pip.py

RUN apt-get -y install openssh-server

EXPOSE 22
