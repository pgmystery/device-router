FROM ubuntu:20.04

RUN apt-get -y update && apt-get -y upgrade \
    && apt-get -y install curl \
    && apt-get -y install python2.7 \
    && curl https://bootstrap.pypa.io/pip/2.7/get-pip.py -o /tmp/get-pip.py \
    && python2.7 /tmp/get-pip.py \
    && apt-get -y install openssh-server \
    && useradd -rm -d /home/ubuntu -s /bin/bash -g root -G sudo -u 1000 test \
    && echo 'test:test' | chpasswd \
    && service ssh start

EXPOSE 22

CMD ["/usr/sbin/sshd","-D"]
