SHELL := /bin/bash
BASEDIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

# Settings
NAMESPACE := jterrazz
APPLICATION := $(NAMESPACE)-web

# Targets (application)
DOCKER_RUN := docker run .
DOCKER_VOLUMES := -v "$(BASEDIR)/src:/home/src" -v "$(BASEDIR)/tests:/home/__tests__"

build:
	docker build . -t $(APPLICATION)

start:
	$(DOCKER_RUN) -t $(APPLICATION) npm run start

start-dev:
	$(DOCKER_RUN) $(DOCKER_VOLUMES) -t $(APPLICATION) npm run start-dev

test:
	$(DOCKER_RUN) $(DOCKER_VOLUMES) -t $(APPLICATION) npm run test

lint-type:
	$(DOCKER_RUN) $(DOCKER_VOLUMES) -t $(APPLICATION) npm run lint-type

lint-code:
	$(DOCKER_RUN) $(DOCKER_VOLUMES) -t $(APPLICATION) npm run lint-code

lint-style:
	$(DOCKER_RUN) $(DOCKER_VOLUMES) -t $(APPLICATION) npm run lint-style

.PHONY: build start start-dev test lint-type lint-code lint-style
