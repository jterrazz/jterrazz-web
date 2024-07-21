SHELL := /bin/bash
BASEDIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

# Settings
NAMESPACE := jterrazz
TAG := $(NAMESPACE)-web

# Targets (application)
DOCKER_RUN := docker run
DOCKER_VOLUMES := -v "$(BASEDIR)/src:/home/src" -v "$(BASEDIR)/__tests__:/home/__tests__"

build:
	docker build . -t $(TAG)

start:
	$(DOCKER_RUN) $(DOCKER_VOLUMES) $(TAG)

dev:
	$(DOCKER_RUN) $(DOCKER_VOLUMES) -p 3000:3000 $(TAG) npm run dev

test:
	$(DOCKER_RUN) $(DOCKER_VOLUMES) $(TAG) npm run test

lint:
	$(DOCKER_RUN) $(DOCKER_VOLUMES) $(TAG) npm run lint

clean:
	npm run clean && docker rmi $(TAG)

.PHONY: build start dev test lint clean
