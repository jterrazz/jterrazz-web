.PHONY: test lint build dev clean

test:
	pnpm install --frozen-lockfile
	pnpm test run

lint:
	pnpm install --frozen-lockfile
	pnpm lint

build:
	pnpm install --frozen-lockfile
	pnpm build

dev:
	pnpm dev

clean:
	pnpm clean
