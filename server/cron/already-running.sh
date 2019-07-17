
mypidfile=/var/run/already-running.sh.pid

if [ -e $mypidfile ]; then
  echo "script is already running"
  exit
fi

# Could add check for existence of mypidfile here if interlock is
# needed in the shell script itself.

# Ensure PID file is removed on program exit.
trap "rm -f -- '$mypidfile'" EXIT

# Create a file with current PID to indicate that process is running.
echo $$ > "$mypidfile"

while :; do echo 'Hit CTRL+C'; sleep 1; done

~
