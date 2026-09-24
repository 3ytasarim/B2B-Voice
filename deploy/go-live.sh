#!/usr/bin/env bash
# Switches PRODUCTION to the SEO branch: builds it in /var/www/b2b-voice and
# installs the new nginx routing. Backs up nginx first; restores it if
# `nginx -t` fails. Rollback afterwards: bash deploy/rollback.sh
set -euo pipefail
BRANCH="${1:-seo/ssg-overhaul}"
PROD=/var/www/b2b-voice
BACKUP=/root/nginx-backup-b2b-voice
CONF=$(grep -l "server_name b2b-voice.com" /etc/nginx/sites-enabled/* | head -1)

[ -n "$CONF" ] || { echo "b2b-voice nginx file not found"; exit 1; }
if [ "$(grep -c 'server_name' "$CONF")" -gt 3 ]; then
  echo "$CONF also holds other sites. Edit it by hand using deploy/nginx/b2b-voice.conf"
  exit 1
fi

mkdir -p "$BACKUP"
cp -a "$CONF" "$BACKUP/$(basename "$CONF").$(date +%Y%m%d-%H%M%S)"
echo "$CONF" > "$BACKUP/CONF_PATH"
git -C "$PROD" rev-parse HEAD > "$BACKUP/PREVIOUS_COMMIT"

cd "$PROD"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"
pnpm install --frozen-lockfile
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/b2bvoice run build

sudo cp "$PROD/deploy/nginx/b2b-voice-locations.conf" /etc/nginx/snippets/b2b-voice-locations.conf
sudo cp "$PROD/deploy/nginx/b2b-voice.conf" "$CONF"
if sudo nginx -t; then
  sudo systemctl reload nginx
  echo "Live. Verify: bash $PROD/deploy/verify.sh https://b2b-voice.com"
else
  LATEST=$(ls -t "$BACKUP"/"$(basename "$CONF")".* | head -1)
  cp -a "$LATEST" "$CONF"
  echo "nginx -t failed; previous config restored, nothing reloaded"
  exit 1
fi
