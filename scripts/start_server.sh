#!/bin/env sh

# DEBUG
# set -x

# immediately exit if any command has a non-zero exit status.
set -e

# Lume watches file changes on background
deno task lume --watch &
# Save Lume background process ID
LUME_PID=$!

# Ensure Lume is killed when script exits
# The signals:
# - EXIT - Script exits normally
# - INT  - User presses Ctrl+C
# - TERM - Process receives termination signal (e.g., from kill command)
trap "kill $LUME_PID" EXIT INT TERM

# Wrangler serve files via HTTP
wrangler dev --live-reload
