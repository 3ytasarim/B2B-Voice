#!/usr/bin/env bash
# Restores the previous nginx config and rebuilds the main branch.
set -euo pipefail
PROD=/var/www/b2b-voice
BACKUP=/root/nginx-backup-b2b-voice
CONF=$(cat "$BACKUP/CONF_PATH")
LATEST=$(ls -t "$BACKUP"/"$(basename "$CONF")".* | head -1)

sudo cp -a "$LATEST" "$CONF"
sudo nginx -t
sudo systemctl reload nginx
cd "$PROD"
git checkout main
pnpm install --frozen-lockfile
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/b2bvoice run build
echo "Rolled back to main + previous nginx config"
