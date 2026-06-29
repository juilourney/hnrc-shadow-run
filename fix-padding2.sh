#!/bin/bash
for file in src/screens/*.js; do
  sed -i '' 's/calc(var(--safe-bottom) + 12px)/30px/g' "$file"
done
