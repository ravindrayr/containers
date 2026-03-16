#!/bin/bash
# Upload files from /app/uploads to S3

set -e

# Validate required env vars
: "${AWS_ACCESS_KEY_ID:?AWS_ACCESS_KEY_ID is not set}"
: "${AWS_SECRET_ACCESS_KEY:?AWS_SECRET_ACCESS_KEY is not set}"
: "${AWS_REGION:?AWS_REGION is not set}"
: "${S3_BUCKET_NAME:?S3_BUCKET_NAME is not set}"

LOCAL_DIR="/app/uploads"

echo "Uploading files from $LOCAL_DIR to s3://$S3_BUCKET_NAME"

aws s3 cp "$LOCAL_DIR" "s3://$S3_BUCKET_NAME" \
  --recursive \
  --region "$AWS_REGION"

echo "Upload complete."
