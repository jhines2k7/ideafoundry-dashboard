#!/usr/bin/env bash
node_modules/.bin/http-server -p 9000 & node_modules/.bin/watch "sh scripts/build-dev.sh" js