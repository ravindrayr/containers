# S3 Upload Container — Project Guide

## Project Overview
- **Name:** S3 Upload Container
- **Description:** Dockerized dev environment for uploading files to AWS S3 using AWS CDK.
- **Type:** CLI / Infrastructure

## Tech Stack
- **Language:** JavaScript (Node.js)
- **Framework:** AWS CDK (v2)
- **Database:** N/A (Uses AWS S3)
- **Testing:** Jest
- **Package Manager:** npm
- **Virtualization:** Docker & Docker Compose

## Project Structure
```text
/
├── cdk/              # AWS CDK application (Infrastructure as Code)
│   ├── index.js      # Main CDK app entry point
│   └── s3-stack.js   # Definition of the S3 bucket stack
├── uploads/          # Local directory for files to be uploaded to S3
├── tests/            # Automated test suite (Jest)
│   ├── env.test.js
│   ├── s3-stack.test.js
│   └── uploads.test.js
├── .devcontainer/    # VS Code Dev Container configuration
├── Dockerfile        # Container image definition
├── docker-compose.yml # Container orchestration
├── upload.sh         # Core shell script for S3 uploads
├── Makefile          # Developer convenience commands
├── .env              # Local credentials (never commit)
└── .env.example      # Template for environment variables
```

## Environment Variables
Ensure these are configured in your `.env` file before running the application:

- `AWS_ACCESS_KEY_ID`: Your AWS access key.
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key.
- `AWS_REGION`: The AWS region (e.g., `us-east-1`).
- `S3_BUCKET_NAME`: The target S3 bucket name.
- `S3_UPLOAD_PATH`: Optional path prefix inside the bucket.

## Key Commands

### Using Makefile (Recommended)
| Command | Description |
| :--- | :--- |
| `make setup` | Create `.env` and `docker-compose.override.yml` from examples. |
| `make up` | Start all containers in detached mode. |
| `make down` | Stop and remove all containers. |
| `make logs` | Follow logs from all running containers. |
| `make shell` | Open an interactive bash shell in the `dev` container. |
| `make build` | Rebuild Docker images from scratch. |
| `make test` | Run the full test suite inside the container. |
| `make clean` | Remove containers, volumes, and images. |

### Using NPM (Inside Container)
| Command | Description |
| :--- | :--- |
| `npm test` | Run all Jest tests. |
| `npm run test:watch` | Run tests in watch mode. |
| `npm run test:coverage` | Generate a test coverage report. |
| `npx cdk deploy` | Deploy the CDK stack to AWS. |
| `npx cdk destroy` | Tear down the deployed AWS stack. |
| `npx cdk diff` | Compare local CDK changes with the deployed stack. |

## Coding Conventions
- **Style:** CommonJS (`require`/`module.exports`).
- **Naming:** `camelCase` for variables and functions.
- **Indentation:** 2 spaces for all file types.
- **Formating:** Standard Prettier-style formatting.
- **Integrity:** Always verify infrastructure changes with `npx cdk diff` before deploying.

## Testing
The project uses **Jest** for testing. Tests are located in the `tests/` directory and follow the `*.test.js` naming convention.
- To run tests locally: `npm test`
- To run tests via Docker: `make test`

## Important Notes
- **Scope:** Only modify or create files within the `containers` directory.
- **Security:** Never commit your `.env` file or any AWS credentials to version control.
- **CDK:** Ensure your AWS CLI is configured or `.env` variables are correctly set for CDK deployments.
