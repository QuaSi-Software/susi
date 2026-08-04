#!/bin/sh

cd "$BASE_DIR/" || exit 1

# Generate config.json
env_vars="VITE_RESI_DATA_URL"

JSON_STRING='{'
for env_var in $env_vars; do
  value=$(printenv "$env_var")
  escaped_value=$(printf '%s' "$value" | sed 's/\\/\\\\/g; s/"/\\"/g')
  JSON_STRING="$JSON_STRING \"$env_var\":\"$escaped_value\","
done
JSON_STRING=$(printf '%s' "$JSON_STRING" | sed 's/,$//')
JSON_STRING="$JSON_STRING }"

rm -f "$BASE_DIR/config.json"
printf '%s\n' "$JSON_STRING" > "$BASE_DIR/config.json"

exec docker-entrypoint.sh "$@"