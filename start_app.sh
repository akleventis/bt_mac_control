#!/bin/bash
# make executable: chmod +x start_app.sh

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=`dirname "$SCRIPT"`
cd $SCRIPTPATH

echo $SCRIPTPATH

python python/server.py & npx expo start