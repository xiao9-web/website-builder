# PostgreSQL Init Scripts

Files in this directory are executed by PostgreSQL on first container start (empty data volume).

Execution order is alphabetical by filename:
- `01-schema.sql` — table definitions, indexes, tsvector columns
- `02-seed.sql` — initial data (admin user, default categories)

Add new scripts with a numeric prefix to control ordering.

Note: These scripts only run when the data volume is empty. To re-run them,
remove the volume first: `docker volume rm blog_postgres_data`
