REPORTS_PID_FILE=/var/run/notify-daily-tree-count.pid

if [ -e $REPORTS_PID_FILE ]; then
  echo "script is already running"
  exit
fi

# Ensure PID file is removed on program exit.
trap "rm -f -- '$REPORTS_PID_FILE'" EXIT

# Create a file with current PID to indicate that process is running.
echo $$ > "$REPORTS_PID_FILE"

/usr/bin/node /root/treetracker-web-map/server/cron/notify-daily-tree-count.js >>/root/treetracker-web-map/server/cron/log-file.txt 2>/root/treetracker-web-map/server/cron/log-file.txt
