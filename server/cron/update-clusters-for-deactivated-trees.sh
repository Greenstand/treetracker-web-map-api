PID_FILE=/var/run/update-clusters-for-deactivated-trees.pid
LOG_FILE=/var/log/treetracker-cron-update-clusters-for-deactivated-trees

if [ -e $PID_FILE ]; then
  echo "script is already running"
  exit
fi

# Ensure PID file is removed on program exit.
trap "rm -f -- '$PID_FILE'" EXIT

# Create a file with current PID to indicate that process is running.
echo $$ > "$PID_FILE"

/usr/bin/node /root/treetracker-map-api/cron/update-clusters-for-deactivated-trees.js >>$LOG_FILE 2>$LOG_FILE
