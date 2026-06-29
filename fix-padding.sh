#!/bin/bash
for file in src/screens/*.js; do
  # Replace large safe-bottom padding in scroll-body inline styles
  # For name.js, card.js, role.js, etc.
  sed -i '' 's/calc(var(--safe-bottom) + 32px)/calc(var(--safe-bottom) + 12px)/g' "$file"
  
  # For waiting.js
  sed -i '' 's/calc(var(--safe-bottom) + 90px)/40px/g' "$file"
  
  # For bolt-result.js
  sed -i '' 's/calc(var(--safe-bottom) + 100px)/calc(var(--safe-bottom) + 40px)/g' "$file"
done
