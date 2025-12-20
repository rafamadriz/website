#!/bin/env sh

# immediately exit if any command has a non-zero exit status.
set -e

PROJECT_ROOT=$(npm prefix)

if [ -d "$PROJECT_ROOT/public" ]; then
    echo "REMOVING: $PROJECT_ROOT/public"
    rm -r "$PROJECT_ROOT/public"
fi

# BUILD
cd $PROJECT_ROOT && npx @11ty/eleventy
