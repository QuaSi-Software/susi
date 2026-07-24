#!/bin/sh
set -eu

: "${API_BACKEND_URL:?Environment variable API_BACKEND_URL is required}"

# Replace placeholder in nginx.conf.template with actual backend URL
sed "s|{{API_BACKEND_URL}}|${API_BACKEND_URL%/}|g" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'
