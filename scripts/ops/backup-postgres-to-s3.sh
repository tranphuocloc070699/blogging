#!/usr/bin/env bash
set -euo pipefail

# ── Load env if not already set ──────────────────────────────────────────────
if [ -f /var/www/blogging/.env ]; then
  export $(grep -v '^#' /var/www/blogging/.env | xargs)
fi

# ── Validate required vars ────────────────────────────────────────────────────
: "${POSTGRES_USER:?Missing POSTGRES_USER}"
: "${POSTGRES_DB:?Missing POSTGRES_DB}"
: "${POSTGRES_PASSWORD:?Missing POSTGRES_PASSWORD}"
: "${BACKUP_AWS_ACCESS_KEY:?Missing BACKUP_AWS_ACCESS_KEY}"
: "${BACKUP_AWS_SECRET_KEY:?Missing BACKUP_AWS_SECRET_KEY}"
: "${BACKUP_AWS_REGION:?Missing BACKUP_AWS_REGION}"
: "${BACKUP_S3_BUCKET:?Missing BACKUP_S3_BUCKET}"

# ── Config ────────────────────────────────────────────────────────────────────
BACKUP_S3_PREFIX="${BACKUP_S3_PREFIX:-postgres/blogging/prod}"
timestamp="$(date +%F-%H%M%S)"
filename="blogging-prod-${timestamp}.dump"
tmp_dir="/tmp/blogging-db-backups"
file_path="${tmp_dir}/${filename}"
object_key="${BACKUP_S3_PREFIX}/$(date +%Y/%m/%d)/${filename}"

mkdir -p "$tmp_dir"

# ── Dump ──────────────────────────────────────────────────────────────────────
echo "[backup] Starting pg_dump at ${timestamp}..."

docker exec postgres-blog pg_dump \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  --format=custom \
  --compress=9 \
  --no-owner \
  --no-privileges \
  > "$file_path"

echo "[backup] Dump complete: ${file_path}"

# ── Checksum ──────────────────────────────────────────────────────────────────
sha256sum "$file_path" > "${file_path}.sha256"
echo "[backup] Checksum: $(cat ${file_path}.sha256)"

# ── Upload ────────────────────────────────────────────────────────────────────
echo "[backup] Uploading to s3://${BACKUP_S3_BUCKET}/${object_key}..."

AWS_ACCESS_KEY_ID="$BACKUP_AWS_ACCESS_KEY" \
AWS_SECRET_ACCESS_KEY="$BACKUP_AWS_SECRET_KEY" \
AWS_DEFAULT_REGION="$BACKUP_AWS_REGION" \
aws s3 cp "$file_path" "s3://${BACKUP_S3_BUCKET}/${object_key}"

AWS_ACCESS_KEY_ID="$BACKUP_AWS_ACCESS_KEY" \
AWS_SECRET_ACCESS_KEY="$BACKUP_AWS_SECRET_KEY" \
AWS_DEFAULT_REGION="$BACKUP_AWS_REGION" \
aws s3 cp "${file_path}.sha256" "s3://${BACKUP_S3_BUCKET}/${object_key}.sha256"

# ── Verify ────────────────────────────────────────────────────────────────────
echo "[backup] Verifying upload..."

AWS_ACCESS_KEY_ID="$BACKUP_AWS_ACCESS_KEY" \
AWS_SECRET_ACCESS_KEY="$BACKUP_AWS_SECRET_KEY" \
AWS_DEFAULT_REGION="$BACKUP_AWS_REGION" \
aws s3api head-object \
  --bucket "$BACKUP_S3_BUCKET" \
  --key "$object_key" >/dev/null

echo "[backup] Verified ✓"

# ── Cleanup ───────────────────────────────────────────────────────────────────
rm -f "$file_path" "${file_path}.sha256"
echo "[backup] Local temp files cleaned"

echo "[backup] Done — s3://${BACKUP_S3_BUCKET}/${object_key}"
