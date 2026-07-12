#!/bin/bash
if [ -z "$1" ]; then
  echo "Usage: ./scripts/migrate.sh <SUPABASE_DB_URI>"
  exit 1
fi
npx supabase db push --db-url "$1"
