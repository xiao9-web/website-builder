.PHONY: dev-up dev-down dev-up-full demo docker-demo-up docker-demo-down docker-demo-reset docker-demo-logs docker-demo-config k8s-validate db-migrate db-status server-start web-start start clean help

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

demo: ## One-command full local demo startup with readiness checks
	./start-demo.sh

docker-demo-up: ## Build and start full Docker demo stack (PostgreSQL + Redis + backend + frontend)
	docker compose -f docker/docker-compose.full.yml up -d --build

docker-demo-down: ## Stop full Docker demo stack
	docker compose -f docker/docker-compose.full.yml down

docker-demo-reset: ## Stop full Docker demo stack and remove volumes
	docker compose -f docker/docker-compose.full.yml down -v

docker-demo-logs: ## Tail full Docker demo stack logs
	docker compose -f docker/docker-compose.full.yml logs -f

docker-demo-config: ## Validate full Docker demo compose config
	docker compose -f docker/docker-compose.full.yml config >/dev/null

k8s-validate: ## Validate Kubernetes manifests with kubectl dry-run
	kubectl kustomize deploy/k8s >/dev/null

db-migrate: ## Run Flyway database migrations
	mvn -f apps/server/pom.xml -Dflyway.url=jdbc:postgresql://localhost:5432/website_builder -Dflyway.user=wb_user -Dflyway.password=wb_pass flyway:migrate

db-status: ## Show Flyway migration status
	mvn -f apps/server/pom.xml -Dflyway.url=jdbc:postgresql://localhost:5432/website_builder -Dflyway.user=wb_user -Dflyway.password=wb_pass flyway:info

server-start: ## Start Spring Boot server
	DB_USERNAME=wb_user DB_PASSWORD=wb_pass mvn -f apps/server/pom.xml spring-boot:run

web-start: ## Start Next.js dev server
	cd apps/web && npm run dev

start: dev-up ## Start Docker services, Spring Boot server, and Next.js web app
	$(MAKE) -j2 server-start web-start

clean: ## Clean all build artifacts
	mvn -f apps/server/pom.xml clean 2>/dev/null || true
	cd apps/web && rm -rf .next node_modules/.cache 2>/dev/null || true
	docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml down -v 2>/dev/null || true

logs-db: ## Tail PostgreSQL logs
	docker logs -f wb-postgres

logs-redis: ## Tail Redis logs
	docker logs -f wb-redis
