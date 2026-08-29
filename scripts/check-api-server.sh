#!/usr/bin/env bash
# Diagnostic script for the "Could not load leads / API server not running" issue.
# Run this ON THE HETZNER SERVER (via SSH), not locally — it checks systemd/pm2/docker,
# DATABASE_URL, listening ports, and hits /api/leads directly. Read-only, changes nothing.

echo "=== 1) DATABASE_URL in current shell ==="
env | grep -i DATABASE_URL || echo "  (not set in this shell — that's expected if it's set inside a service file instead)"

echo
echo "=== 2) DATABASE_URL in common .env locations ==="
for f in ./.env ./artifacts/api-server/.env ~/.env /etc/environment "$HOME"/B2B-Voice/.env "$HOME"/B2B-Voice/artifacts/api-server/.env; do
  if [ -f "$f" ]; then
    echo "--- $f ---"
    if grep -q "DATABASE_URL" "$f" 2>/dev/null; then
      echo "  DATABASE_URL is present (value hidden)"
    else
      echo "  DATABASE_URL NOT found in this file"
    fi
  fi
done

echo
echo "=== 3) pm2 ==="
if command -v pm2 >/dev/null 2>&1; then
  pm2 list
  echo "  (if a process is listed but 'errored'/'stopped', run: pm2 logs <name> --lines 50)"
else
  echo "  pm2 not installed"
fi

echo
echo "=== 4) systemd services (matching api/b2b/voice/node) ==="
if command -v systemctl >/dev/null 2>&1; then
  systemctl list-units --type=service --all 2>/dev/null | grep -iE 'api|b2b|voice|node' \
    || echo "  no matching service found"
else
  echo "  systemctl not available"
fi

echo
echo "=== 5) docker ==="
if command -v docker >/dev/null 2>&1; then
  docker ps -a
else
  echo "  docker not installed"
fi

echo
echo "=== 6) raw node processes ==="
ps aux | grep -i "node" | grep -v grep || echo "  no node process running"

echo
echo "=== 7) listening ports ==="
(ss -tlnp 2>/dev/null || netstat -tlnp 2>/dev/null) || echo "  couldn't list ports (try: sudo ss -tlnp)"

echo
echo "=== 8) direct API test (common ports) ==="
for port in 3001 3000 8080 5000; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "http://localhost:$port/api/leads" 2>/dev/null)
  echo "  http://localhost:$port/api/leads -> ${code:-no response}"
done

echo
echo "=== 9) nginx config for /api (if nginx is used) ==="
if command -v nginx >/dev/null 2>&1; then
  grep -A3 "location /api" /etc/nginx/sites-enabled/* 2>/dev/null \
    || echo "  no 'location /api' block found in /etc/nginx/sites-enabled/*"
else
  echo "  nginx not found"
fi

echo
echo "=== Done — paste this whole output back and the exact cause can be pinpointed. ==="
