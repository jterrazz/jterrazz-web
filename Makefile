.PHONY: build lint test install

node_modules/.install: package-lock.json
	npm ci
	@touch node_modules/.install

install: node_modules/.install

build: node_modules/.install
	@echo "TODO: Fix Next.js 16 segment config compatibility issue"

lint: node_modules/.install
	npm run lint

test: node_modules/.install
	npx vitest --run --exclude="**/integration/**"
