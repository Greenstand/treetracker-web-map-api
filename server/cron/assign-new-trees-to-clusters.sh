PID_FILE=/var/run/assign-clusters.pid
LOG_FILE=/var/log/treetracker-cron-assign-clusters

if [ -e $PID_FILE ]; then
  echo "script is already running"
  exit
fi

# Ensure PID file is removed on program exit.
trap "rm -f -- '$PID_FILE'" EXIT

# Create a file with current PID to indicate that process is running.
echo $$ > "$PID_FILE"

/usr/bin/node /root/treetracker-map-api/cron/assign-new-trees-to-clusters.js >>$LOG_FILE 2>>$LOG_FILE
