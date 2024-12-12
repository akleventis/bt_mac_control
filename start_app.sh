#!/bin/bash

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=`dirname "$SCRIPT"`
cd $SCRIPTPATH


# ensures both the python server and expo process are terminated cleanly upon Ctrl+C
trap 'pkill -P $$' SIGINT SIGTERM

# start both processes and store their id's
python python/server.py & 
PYTHON_PID=$!

npx expo start &
EXPO_PID=$!


echo $PYTHON_PID
echo $EXPO_PID

trap "echo 'Stopping processes...'; kill -TERM $PYTHON_PID $EXPO_PID; exit" SIGINT SIGTERM

wait