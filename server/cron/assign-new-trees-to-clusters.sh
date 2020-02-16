REBUILD_CLUSTERS_PID_FILE=/var/run/assign-clusters.pid

if [ -e $REBUILD_CLUSTERS_PID_FILE ]; then
  echo "script is already running"
  exit
fi

# Ensure PID file is removed on program exit.
trap "rm -f -- '$REBUILD_CLUSTERS_PID_FILE'" EXIT

# Create a file with current PID to indicate that process is running.
echo $$ > "$REBUILD_CLUSTERS_PID_FILE"

/usr/bin/node /root/treetracker-web-map/server/cron/assign-new-trees-to-clusters.js >>/root/treetracker-web-map/server/cron/assign-clusters-log-file.txt 2>>/root/treetracker-web-map/server/cron/assign-clusters-log-file.txt
