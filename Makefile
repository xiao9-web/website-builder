.PHONY: dev-up dev-down dev-up-full dev-up-tools docker-proxy-doctor demo docker-demo-up docker-demo-down docker-demo-reset docker-demo-logs docker-demo-config prod-aliyun-config prod-aliyun-up prod-aliyun-down prod-aliyun-ps prod-aliyun-logs prod-aliyun-health prod-aliyun-backup k8s-validate db-migrate db-status server-start web-start start clean help

# Default target
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev-up: ## Start base Docker services (PostgreSQL + Redis)
	SKIP_DEV_TOOLS=1 ./scripts/dev-up-full.sh

dev-up-full: ## Start all Docker services including dev tools (pgAdmin, Redis Commander)
	./scripts/dev-up-full.sh

dev-up-tools: ## Start optional dev tools only (pgAdmin + Redis Commander)
	COMPOSE_IGNORE_ORPHANS=True docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d pgadmin redis-commander

docker-proxy-doctor: ## Diagnose Docker proxy and registry pull issues
	./scripts/docker-proxy-doctor.sh

dev-down: ## Stop all Docker services
	COMPOSE_IGNORE_ORPHANS=True docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml down

dev-reset: ## Stop services and remove volumes (fresh start)
	COMPOSE_IGNORE_ORPHANS=True docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml down -v

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

prod-aliyun-config: ## Validate Aliyun 2c2g production compose config
	docker compose -f docker-compose.prod.aliyun-2c2g.yml --env-file .env.prod config >/dev/null

prod-aliyun-up: ## Build and start Aliyun 2c2g production stack
	./scripts/aliyun-2c2g-deploy.sh

prod-aliyun-down: ## Stop Aliyun 2c2g production stack
	docker compose -f docker-compose.prod.aliyun-2c2g.yml --env-file .env.prod down

prod-aliyun-ps: ## Show Aliyun 2c2g production containers
	docker compose -f docker-compose.prod.aliyun-2c2g.yml --env-file .env.prod ps

prod-aliyun-logs: ## Tail Aliyun 2c2g production logs
	docker compose -f docker-compose.prod.aliyun-2c2g.yml --env-file .env.prod logs -f --tail=200

prod-aliyun-health: ## Check Aliyun 2c2g local health endpoints
	curl -fsS http://127.0.0.1/healthz && curl -fsS http://127.0.0.1/actuator/health

prod-aliyun-backup: ## Backup Aliyun 2c2g PostgreSQL and uploads
	./scripts/aliyun-2c2g-backup.sh

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
	COMPOSE_IGNORE_ORPHANS=True docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml down -v 2>/dev/null || true

logs-db: ## Tail PostgreSQL logs
	docker logs -f wb-postgres

logs-redis: ## Tail Redis logs
	docker logs -f wb-redis
