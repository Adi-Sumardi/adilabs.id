#!/usr/bin/env bash
# Run this locally before pushing a frontend change to production.
#
# Why this exists: frontend/dist is committed to git on purpose (this repo
# deploys to shared hosting via `git pull` over SSH — there's no Node.js
# build step on the server). Vite hashes every JS/CSS filename on each
# build, so a stale or partially-committed dist/ silently breaks the site
# (browser requests the old hashed filename, gets a 404, and — because the
# SPA fallback rewrite serves index.html for any missing file — the error
# shows up as "expected JS, got text/html"). This script removes that
# whole class of mistake: it always rebuilds fresh and stages the complete
# dist/ output, so a stale JS bundle can't slip through.
set -euo pipefail
cd "$(dirname "$0")"

echo "== Building frontend =="
cd frontend
rm -rf dist
npm run build
cd ..

echo "== Staging build output =="
git add frontend/dist

if git diff --cached --quiet; then
  echo "No changes to commit (dist/ already matches source)."
  exit 0
fi

git status --short frontend/dist

read -rp "Commit message: " msg
git commit -m "${msg:-build: update frontend dist}"

read -rp "Push to origin/main now? [y/N] " push_confirm
if [[ "$push_confirm" =~ ^[Yy]$ ]]; then
  git push origin main
  echo "Pushed. On the server, run: ./update.sh"
else
  echo "Committed locally but not pushed. Run 'git push' when ready."
fi
