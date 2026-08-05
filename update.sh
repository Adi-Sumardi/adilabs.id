#!/usr/bin/env bash
# Run this on the server (via Termius/SSH) after build-deploy.sh has pushed
# a new build locally. Pulls the latest commit and sanity-checks that the
# JS/CSS files index.html actually points to exist on disk — this is the
# exact check that would have caught the earlier 404 (missing JS bundle)
# before it ever reached a browser.
set -euo pipefail
cd "$(dirname "$0")"

echo "== Pulling latest from origin/main =="
git pull origin main

DIST=frontend/dist
INDEX="$DIST/index.html"

if [ ! -f "$INDEX" ]; then
  echo "ERROR: $INDEX not found after pull. Deploy aborted." >&2
  exit 1
fi

echo "== Verifying built assets referenced by index.html exist =="
missing=0
for rel in $(grep -oE 'src="\./assets/[^"]+"|href="\./assets/[^"]+"' "$INDEX" | grep -oE 'assets/[^"]+'); do
  if [ ! -f "$DIST/$rel" ]; then
    echo "MISSING: $DIST/$rel (referenced by index.html but not on disk)" >&2
    missing=1
  else
    echo "OK: $rel"
  fi
done

if [ "$missing" -eq 1 ]; then
  echo
  echo "ERROR: index.html references a build asset that isn't present." >&2
  echo "This means frontend/dist wasn't committed correctly on the local side." >&2
  echo "Re-run build-deploy.sh locally, push, then re-run this script." >&2
  exit 1
fi

echo "== Fixing uploads directory permissions =="
chmod -R u+rwX,go+rX api/uploads 2>/dev/null || true

echo
echo "Deploy verified OK. Live site should be up to date."
