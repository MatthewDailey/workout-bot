#!/usr/bin/env bash

tmpFile="start.txt"

lt --port 5000 > $tmpFile &

sleep 2

serverUrl=`grep -oE 'https://.*' $tmpFile`
echo Found server url: $serverUrl


export SERVER_URL=$serverUrl

rm $tmpFile

npm start

# You must run this via: . ./devStart
# this allows the file to properly export serverUrl for test.

# then npm start to run the server
# make sure https://developers.facebook.com/apps/1291586900892998/webhooks/ are properly set.