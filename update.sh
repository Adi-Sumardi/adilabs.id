#!/usr/bin/env bash
# Run this on the server (via Termius/SSH) after build-deploy.sh has pushed
# a new build locally.
#
# Repo layout note: this repo is cloned directly into public_html, so the
# document root = repo root. The built frontend lives at frontend/dist/, and
# root-level symlinks (index.html, app-assets, favicon.png, logo-panjang.png)
# make it resolve at the domain root without duplicating files. Those
# symlinks are committed to git — a plain `git pull` keeps them in sync.
set -euo pipefail
cd "$(dirname "$0")"

echo "== Pulling latest from origin/main =="
if ! git pull origin main; then
  echo
  echo "git pull failed — most likely a loose (non-git) file at the repo root" >&2
  echo "is blocking checkout of a tracked symlink with the same name" >&2
  echo "(index.html, favicon.png, logo-panjang.png, app-assets, assets)." >&2
  echo "Back those up and remove them, then re-run this script:" >&2
  echo "  mkdir -p ~/manual-upload-backup" >&2
  echo "  mv index.html favicon.png logo-panjang.png ~/manual-upload-backup/ 2>/dev/null || true" >&2
  exit 1
fi

INDEX="index.html"
if [ ! -e "$INDEX" ]; then
  echo "ERROR: $INDEX not found at repo root after pull. Deploy aborted." >&2
  exit 1
fi

echo "== Verifying built assets referenced by index.html exist =="
missing=0
for rel in $(grep -oE 'src="\./[^"]+"|href="\./[^"]+"' "$INDEX" | grep -oE '(app-assets|assets)/[^"]+|favicon\.png'); do
  if [ ! -e "$rel" ]; then
    echo "MISSING: $rel (referenced by index.html but not on disk / symlink broken)" >&2
    missing=1
  else
    echo "OK: $rel"
  fi
done

if [ "$missing" -eq 1 ]; then
  echo
  echo "ERROR: index.html references a build asset that isn't present." >&2
  echo "Re-run build-deploy.sh locally, push, then re-run this script." >&2
  exit 1
fi

echo "== Fixing uploads directory permissions =="
chmod -R u+rwX,go+rX api/uploads 2>/dev/null || true

echo
echo "Deploy verified OK. Live site should be up to date."
