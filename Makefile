SHELL := /bin/bash
BASEDIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

# Settings
NAMESPACE := jterrazz
TAG := $(NAMESPACE)-web
DEV_TAG := $(TAG)-dev

# Targets (application)
DOCKER_RUN := docker run
DOCKER_VOLUMES := -v "$(BASEDIR)/src:/home/src" -v "$(BASEDIR)/__tests__:/home/__tests__"

# Check if images exist
IMAGE_EXISTS := $(shell docker images -q $(TAG) 2> /dev/null)
DEV_IMAGE_EXISTS := $(shell docker images -q $(DEV_TAG) 2> /dev/null)

build:
	docker build . -t $(TAG)

build-dev:
	docker build -f Dockerfile.dev . -t $(DEV_TAG)

ensure-image:
	@if [ "$(IMAGE_EXISTS)" = "" ]; then \
		echo "Docker image not found. Building..."; \
		$(MAKE) build; \
	fi

ensure-dev-image:
	@if [ "$(DEV_IMAGE_EXISTS)" = "" ]; then \
		echo "Docker dev image not found. Building..."; \
		$(MAKE) build-dev; \
	fi

start: ensure-image
	$(DOCKER_RUN) $(DOCKER_VOLUMES) $(TAG)

dev: ensure-dev-image
	$(DOCKER_RUN) $(DOCKER_VOLUMES) -p 3000:3000 $(DEV_TAG) npm run dev

test: ensure-dev-image
	$(DOCKER_RUN) $(DOCKER_VOLUMES) $(DEV_TAG) npm run test

lint: ensure-dev-image
	$(DOCKER_RUN) $(DOCKER_VOLUMES) $(DEV_TAG) npm run lint

clean:
	npm run clean && docker rmi $(TAG) $(DEV_TAG) || true

.PHONY: build build-dev start dev test lint clean ensure-image ensure-dev-image
