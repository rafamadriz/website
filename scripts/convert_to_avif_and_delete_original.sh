#!/bin/env sh

PROJECT_ROOT=$(npm prefix)

find "$PROJECT_ROOT" \( -iname "*.png" -or -iname "*.jpg" \) -print0 |
    while IFS= read -r -d '' file; do
        output="${file%.*}.avif"

        if avifenc -q 30..50 "$file" "$output"; then
            rm -- "$file"
        else
            echo "Failed to convert: $file"
        fi
    done
