#!/bin/bash
find src/screens styles -type f -name "*.js" -o -name "*.css" | while read -r file; do
  sed -i '' 's/calc(var(--safe-bottom) + \([0-9]*\)px)/\1px/g' "$file"
done
