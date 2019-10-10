#!/bin/bash

# http://blog.scphillips.com/posts/2013/07/getting-a-python-script-to-run-in-the-background-as-a-service-on-boot/

### BEGIN INIT INFO
# Provides:          match
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: The Match-APP for the Device-Controller of Philipp Glaw
# Description:       The Match-APP for the Device-Controller of Philipp Glaw
### END INIT INFO

# Change the next 3 lines to suit where you install your script and what you want to call it
DIR=[SCRIPT_DIR]
VIRTUALENV_PYTHON=$DIR/virtualenv/bin/python
DAEMON=$DIR/match.py
DAEMON_NAME=match
#
# ="/usr/bin/env python $DAEMON"

# Add any command line options for your daemon here
DAEMON_START_OPTS="--start"
DAEMON_STOP_OPTS="--stop"

# This next line determines what user the script runs as.
# Root generally not recommended but necessary if you are using the Raspberry Pi GPIO from Python.
DAEMON_USER=root

TEMP_PATH=/tmp/
UPDATE_PATH=$TEMP_PATH/match_new

# The process ID of the script when it runs is stored here:
PIDFILE=/var/run/$DAEMON_NAME.pid

. /lib/lsb/init-functions


do_start () {
    if [ -d "$UPDATE_PATH/match" ]&&[ -e "$UPDATE_PATH/match/.update" ]; then
        update_status=`cat $UPDATE_PATH/match/.update`
        if (($update_status == 3)); then
            do_update
        else
            rm -R -f $UPDATE_PATH
            do_run
        fi
    else
            do_run
    fi
}
do_run () {
    log_daemon_msg "Starting system $DAEMON_NAME daemon:"
#   Starting system match daemon:--start --background --pidfile /var/run/match.pid --make-pidfile --user root --chuid root --startas /etc/match/match.py -- --start
    start-stop-daemon --start --background --pidfile $PIDFILE --make-pidfile --user $DAEMON_USER --chuid $DAEMON_USER --startas $VIRTUALENV_PYTHON -- $DAEMON $DAEMON_START_OPTS
#     start-stop-daemon --start --background --pidfile $PIDFILE --make-pidfile --user $DAEMON_USER --chuid $DAEMON_USER --exec $DAEMON_RUN -- $DAEMON_START_OPTS
    log_end_msg $?
}

do_update () {
    log_daemon_msg "Starting the setup.py for an update:"
    $VIRTUALENV_PYTHON $UPDATE_PATH/match/setup.py update
    log_end_msg $?
}

do_stop () {
    log_daemon_msg "Stopping system $DAEMON_NAME daemon:"
    start-stop-daemon --stop --pidfile $PIDFILE --retry 10 -- $DAEMON_STOP_OPTS
    log_end_msg $?
}

do_status () {
    log_daemon_msg "Status of the 'match'-service:"
    status_of_proc "$DAEMON_NAME" "$DAEMON" && exit 0 || exit $?
#    log_end_msg $?
}

case "$1" in

    start|stop)
#        echo "STARTING/STOPPING:" >> /var/log/match_error.log
#        echo $1 >> /var/log/match_error.log
        do_${1}
        do_status
        ;;

    restart|reload|force-reload)
        do_stop
        do_start
        do_status
        ;;

    status)
#        status_of_proc "$DAEMON_NAME" "$DAEMON" && exit 0 || exit $?
        do_status
        ;;

    *)
        echo "Usage: /etc/init.d/$DAEMON_NAME {start|stop|restart|status}"
#        echo $1 >> /var/log/match_error.log
        exit 1
        ;;

esac
exit 0
