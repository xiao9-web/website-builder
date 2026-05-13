.PHONY: dev-up dev-down dev-up-full db-migrate server-start web-start start clean help

# Default target
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev-up: ## Start base Docker services (PostgreSQL + Redis)
	docker compose -f docker/docker-compose.yml up -d

dev-up-full: ## Start all Docker services including dev tools (pgAdmin, Redis Commander)
	docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d

dev-down: ## Stop all Docker services
	docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml down

dev-reset: ## Stop services and remove volumes (fresh start)
	docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml down -v

db-migrate: ## Run Flyway database migrations
	cd apps/server && ./gradlew flywayMigrate

db-status: ## Show Flyway migration status
	cd apps/server && ./gradlew flywayInfo

server-start: ## Start Spring Boot server
	cd apps/server && ./gradlew bootRun

web-start: ## Start Next.js dev server
	cd apps/web && npm run dev

start: dev-up server-start ## Start Docker services and Spring Boot server

clean: ## Clean all build artifacts
	cd apps/server && ./gradlew clean 2>/dev/null || true
	cd apps/web && rm -rf .next node_modules/.cache 2>/dev/null || true
	docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml down -v 2>/dev/null || true

logs-db: ## Tail PostgreSQL logs
	docker logs -f wb-postgres

logs-redis: ## Tail Redis logs
	docker logs -f wb-redis
