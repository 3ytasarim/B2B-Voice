#!/usr/bin/env bash
# Builds the SEO branch in a separate folder and serves it on 127.0.0.1:8081.
# Production (/var/www/b2b-voice) is NOT touched.
set -euo pipefail
BRANCH="${1:-seo/ssg-overhaul}"
PROD=/var/www/b2b-voice
STAGE=/var/www/b2b-voice-staging

cd "$PROD"
git fetch origin "$BRANCH"
if [ ! -d "$STAGE" ]; then
  git worktree add "$STAGE" "origin/$BRANCH" --detach
else
  git -C "$STAGE" checkout --detach "origin/$BRANCH"
fi

cd "$STAGE"
pnpm install --frozen-lockfile
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/b2bvoice run build

sudo cp "$STAGE/deploy/nginx/b2b-voice-locations.conf" /etc/nginx/snippets/b2b-voice-locations.conf
sudo cp "$STAGE/deploy/nginx/b2b-voice-staging.conf" /etc/nginx/sites-available/b2b-voice-staging
sudo ln -sf /etc/nginx/sites-available/b2b-voice-staging /etc/nginx/sites-enabled/b2b-voice-staging
sudo nginx -t
sudo systemctl reload nginx
echo "Staging ready. Now run: bash $STAGE/deploy/verify.sh http://127.0.0.1:8081"
