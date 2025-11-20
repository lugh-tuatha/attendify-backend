#!/bin/bash

# ============================================
# RAILWAY POSTGRES DATABASE BACKUP SCRIPT
# --------------------------------------------
# This script creates a full PostgreSQL backup
# using pg_dump in custom format (.dump).
#
# The backup will be saved in the /backups folder.
# ============================================

# Backup file name with timestamp (recommended)
BACKUP_FILE="railway_backup_$(date +%Y-%m-%d_%H-%M-%S).dump"

# Run backup
pg_dump \
  -h centerbeam.proxy.rlwy.net \
  -p 20774 \
  -U postgres \
  -d railway \
  -F c -b -v \
  -f "./backups/$BACKUP_FILE"s

echo "✅ Backup completed: backups/$BACKUP_FILE"
