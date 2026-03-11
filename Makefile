# ----------------------------
# Dev Container Makefile
# Usage: make <command>
# ----------------------------

.PHONY: setup up down restart logs shell build clean

## First-time setup for new developers
setup:
	@cp -n .env.example .env || true
	@cp -n docker-compose.override.yml.example docker-compose.override.yml || true
	@echo "Setup complete. Fill in your .env before running 'make up'."

## Start all containers
up:
	docker-compose up -d

## Stop all containers
down:
	docker-compose down

## Restart all containers
restart:
	docker-compose down && docker-compose up -d

## View logs
logs:
	docker-compose logs -f

## Open shell in dev container
shell:
	docker-compose exec dev bash

## Rebuild images
build:
	docker-compose build --no-cache

## Remove containers, volumes, and images
clean:
	docker-compose down -v --rmi all

## Run all tests
test:
	docker-compose run --rm dev sh -c "npm install && npm test"

## Run tests with coverage
test-coverage:
	docker-compose run --rm dev sh -c "npm install && npm run test:coverage"
