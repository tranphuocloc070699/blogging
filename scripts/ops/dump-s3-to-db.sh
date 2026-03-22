# ── Accept filename as argument (from Discord notification) ───────────────────
if [ $# -ge 1 ]; then
  INPUT="$1"
  # Strip leading s3://bucket/ if user pastes full S3 URL
  INPUT="${INPUT#s3://${BACKUP_S3_BUCKET}/}"
  SELECTED_KEY="$INPUT"
  FILENAME=$(basename "$SELECTED_KEY")
  CHECKSUM_KEY="${SELECTED_KEY}.sha256"
  echo "[restore] Using provided file: $SELECTED_KEY"
else
  # ── List available backups ────────────────────────────────────────────────
  echo ""
  echo "[restore] Fetching available backups from s3://${BACKUP_S3_BUCKET}..."
  echo ""

  mapfile -t BACKUPS < <(
    aws s3 ls "s3://${BACKUP_S3_BUCKET}/" --recursive \
      | grep '\.dump$' \
      | sort -r \
      | awk '{print $4}'
  )

  if [ ${#BACKUPS[@]} -eq 0 ]; then
    echo "[restore] No backup files found in s3://${BACKUP_S3_BUCKET}"
    exit 1
  fi

  echo "Available backups (newest first):"
  echo ""
  for i in "${!BACKUPS[@]}"; do
    echo "  [$((i+1))] ${BACKUPS[$i]}"
  done
  echo ""
  read -rp "Select backup number [1]: " SELECTION
  SELECTION="${SELECTION:-1}"
  SELECTED_KEY="${BACKUPS[$((SELECTION-1))]}"
  FILENAME=$(basename "$SELECTED_KEY")
  CHECKSUM_KEY="${SELECTED_KEY}.sha256"

  echo ""
  echo "[restore] Selected: $SELECTED_KEY"
fi
