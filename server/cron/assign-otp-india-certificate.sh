PID_FILE=/var/run/assign-otp-india-certificate.pid

if [ -e $PID_FILE ]; then
  echo "script is already running"
  exit
fi

# Ensure PID file is removed on program exit.
trap "rm -f -- '$PID_FILE'" EXIT

# Create a file with current PID to indicate that process is running.
echo $$ > "$PID_FILE"

/usr/bin/node /root/treetracker-web-map/server/cron/assign-otp-india-certificate.js >>/root/treetracker-web-map/server/cron/assign-otp-india-log-file.txt 2>>/root/treetracker-web-map/server/cron/assign-otp-india-log-file.txt
