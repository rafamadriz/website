#!/bin/env sh

# DEBUG
# set -x

# immediately exit if any command has a non-zero exit status.
set -e

PROJECT_ROOT=$(npm prefix)

if [ -d "$PROJECT_ROOT/public" ]; then
    echo "REMOVING: $PROJECT_ROOT/public"
    rm -r "$PROJECT_ROOT/public"
fi

cd $PROJECT_ROOT

# BUILD
# Running build before serving seems redundant but it's there to guarantee
# that public is complete before wrangler starts serving it.
npx @11ty/eleventy

# Eleventy watches file changes on background
npx @11ty/eleventy --watch --quiet --ignore-initial &
# Save Eleventy background process ID
ELEVENTY_PID=$!

# Ensure Eleventy is killed when script exits
# The signals:
# - EXIT - Script exits normally
# - INT  - User presses Ctrl+C
# - TERM - Process receives termination signal (e.g., from kill command)
trap "kill $ELEVENTY_PID" EXIT INT TERM

# Wrangler serve files via HTTP
npx wrangler dev --live-reload
