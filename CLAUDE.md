# CLAUDE.md — Project Instructions

## Project Overview
- **Name:** S3 Upload Container
- **Description:** Dockerized dev environment for uploading files to AWS S3 using AWS CDK
- **Type:** CLI / Infrastructure

## Tech Stack
- **Language:** JavaScript (Node.js)
- **Framework:** AWS CDK
- **Database:** N/A
- **Package Manager:** npm

## Project Structure
```
/
├── cdk/              # AWS CDK app (Node.js)
├── uploads/          # Files to upload to S3
├── .devcontainer/    # VS Code dev container config
├── Dockerfile        # Container image
├── docker-compose.yml
├── upload.sh         # S3 upload script
├── Makefile          # Developer commands
├── .env              # Local credentials (never commit)
└── .env.example      # Credentials template (safe to commit)
```

## Coding Conventions
- **Style:** CommonJS (require/module.exports)
- **Naming:** camelCase
- **Indentation:** 2 spaces
- **Linting/Formatting:** Prettier

## Key Commands
```bash
# Install dependencies
npm install

# Deploy CDK stack
npx cdk deploy

# Destroy CDK stack
npx cdk destroy

# Start containers
make up

# Upload files to S3
make up && docker-compose logs s3-uploader
```

## Environment Variables
- `AWS_ACCESS_KEY_ID` — AWS access key
- `AWS_SECRET_ACCESS_KEY` — AWS secret key
- `AWS_REGION` — AWS region (e.g. us-east-1)
- `S3_BUCKET_NAME` — Target S3 bucket name
- `S3_UPLOAD_PATH` — Upload path prefix inside the bucket

## Important Notes
- Only create or modify files inside the `containers` folder. Do not create or edit files outside of it.

