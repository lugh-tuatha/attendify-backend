#!/bin/bash

# ============================================
# RAILWAY POSTGRES DATABASE RESTORE SCRIPT
# --------------------------------------------
# This script restores a PostgreSQL database
# from a .dump file using pg_restore.
#
# NOTE:
#  - The restore will OVERWRITE existing data.
#  - Make sure you chose the correct dump file.
# ============================================

DUMP_FILE=$1

if [ -z "$DUMP_FILE" ]; then
  echo "❌ Error: No dump file supplied."
  echo "Usage: ./restore_railway.sh path/to/your_backup.dump"
  exit 1
fi

# Run restore
pg_restore \
  -h centerbeam.proxy.rlwy.net \
  -p 20774 \
  -U postgres \
  -d railway \
  -c \
  "$DUMP_FILE"

echo "✅ Restore completed from $DUMP_FILE"
