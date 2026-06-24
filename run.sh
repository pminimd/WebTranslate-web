#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

export PORT="${PORT:-5007}"
export NODE_ENV="${NODE_ENV:-production}"

if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js is required. Install Node 18+ first." >&2
  exit 1
fi

if [[ ! -d node_modules/serve ]]; then
  echo "Installing dependencies..."
  if [[ -f package-lock.json ]]; then
    npm ci --omit=dev
  else
    npm install --omit=dev
  fi
fi

echo "Web Translate landing page → http://0.0.0.0:${PORT}"
exec npm start
