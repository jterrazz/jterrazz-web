.PHONY: build lint lint-fix test test-network install clean

node_modules/.install: package-lock.json
	npm ci
	@touch node_modules/.install

install: node_modules/.install

build: node_modules/.install
	npm run build

lint: node_modules/.install
	npm run lint

lint-fix: node_modules/.install
	npm run lint:fix

test: node_modules/.install
	npm test

test-network: node_modules/.install
	npm run test:network

clean:
	rm -rf dist node_modules
