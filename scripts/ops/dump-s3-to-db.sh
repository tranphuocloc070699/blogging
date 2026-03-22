#!/usr/bin/env bash
set -euo pipefail

# ── Load env ──────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="${ENV_FILE:-${PROJECT_ROOT}/.env}"

if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
else
  echo "[restore] ❌ .env not found at $ENV_FILE"
  exit 1
fi

# ── Validate ──────────────────────────────────────────────────────────────────
: "${BACKUP_AWS_ACCESS_KEY:?Missing BACKUP_AWS_ACCESS_KEY}"
: "${BACKUP_AWS_SECRET_KEY:?Missing BACKUP_AWS_SECRET_KEY}"
: "${BACKUP_AWS_REGION:?Missing BACKUP_AWS_REGION}"
: "${BACKUP_S3_BUCKET:?Missing BACKUP_S3_BUCKET}"
: "${POSTGRES_USER:?Missing POSTGRES_USER}"
: "${POSTGRES_DB:?Missing POSTGRES_DB}"

POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-postgres-blog}"

export AWS_ACCESS_KEY_ID="$BACKUP_AWS_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$BACKUP_AWS_SECRET_KEY"
export AWS_DEFAULT_REGION="$BACKUP_AWS_REGION"

# ── Accept filename as argument ───────────────────────────────────────────────
if [ $# -ge 1 ]; then
  INPUT="$1"
  INPUT="${INPUT#s3://${BACKUP_S3_BUCKET}/}"
  SELECTED_KEY="$INPUT"
  FILENAME=$(basename "$SELECTED_KEY")
  CHECKSUM_KEY="${SELECTED_KEY}.sha256"
  echo "[restore] Using provided file: $SELECTED_KEY"
else
  echo ""
  echo "[restore] Fetching available backups from s3://${BACKUP_S3_BUCKET}..."
  echo ""

  BACKUPS=()
  while IFS= read -r line; do
    [ -n "$line" ] && BACKUPS+=("$line")
  done < <(
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

# ── Download checksum FIRST ───────────────────────────────────────────────────
TMP_DIR="/tmp/blogging-restore"
mkdir -p "$TMP_DIR"
LOCAL_DUMP="${TMP_DIR}/${FILENAME}"
LOCAL_SHA="${LOCAL_DUMP}.sha256"

echo "[restore] Downloading checksum file..."
if ! aws s3 cp "s3://${BACKUP_S3_BUCKET}/${CHECKSUM_KEY}" "$LOCAL_SHA" 2>/dev/null; then
  echo "[restore] ❌ Checksum file not found: ${CHECKSUM_KEY}"
  exit 1
fi

echo "[restore] Downloading dump file..."
aws s3 cp "s3://${BACKUP_S3_BUCKET}/${SELECTED_KEY}" "$LOCAL_DUMP"

# ── Verify checksum ───────────────────────────────────────────────────────────
echo "[restore] Verifying checksum..."
EXPECTED=$(awk '{print $1}' "$LOCAL_SHA")

if command -v sha256sum &>/dev/null; then
  ACTUAL=$(sha256sum "$LOCAL_DUMP" | awk '{print $1}')
else
  ACTUAL=$(shasum -a 256 "$LOCAL_DUMP" | awk '{print $1}')
fi

if [ "$EXPECTED" != "$ACTUAL" ]; then
  echo "[restore] ❌ Checksum mismatch!"
  echo "  Expected: $EXPECTED"
  echo "  Actual:   $ACTUAL"
  rm -f "$LOCAL_DUMP" "$LOCAL_SHA"
  exit 1
fi

echo "[restore] ✅ Checksum verified: $ACTUAL"

# ── Confirm ───────────────────────────────────────────────────────────────────
echo ""
echo "⚠️  WARNING: This will DROP and RECREATE database '${POSTGRES_DB}'"
echo "   Container: ${POSTGRES_CONTAINER}"
echo "   File:      ${FILENAME}"
echo "   Checksum:  $ACTUAL"
echo ""
read -rp "Type 'yes' to confirm: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "[restore] Aborted."
  rm -f "$LOCAL_DUMP" "$LOCAL_SHA"
  exit 0
fi

# ── Copy into container ───────────────────────────────────────────────────────
echo "[restore] Copying dump into container..."
docker cp "$LOCAL_DUMP" "${POSTGRES_CONTAINER}:/tmp/restore.dump"

# ── Disconnect all connections ────────────────────────────────────────────────
echo "[restore] Terminating active connections..."
docker exec "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -d template1 -c "
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE datname = '${POSTGRES_DB}' AND pid <> pg_backend_pid();"

# ── Drop and recreate ─────────────────────────────────────────────────────────
echo "[restore] Dropping database..."
docker exec "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -d template1 \
  -c "DROP DATABASE IF EXISTS ${POSTGRES_DB};"

echo "[restore] Creating database..."
docker exec "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -d template1 \
  -c "CREATE DATABASE ${POSTGRES_DB};"

# ── Restore ───────────────────────────────────────────────────────────────────
echo "[restore] Restoring from dump..."
docker exec "$POSTGRES_CONTAINER" pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  /tmp/restore.dump

# ── Cleanup ───────────────────────────────────────────────────────────────────
docker exec "$POSTGRES_CONTAINER" rm -f /tmp/restore.dump
rm -f "$LOCAL_DUMP" "$LOCAL_SHA"

echo ""
echo "[restore] ✅ Done — restored from ${FILENAME}"
