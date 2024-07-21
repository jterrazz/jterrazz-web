FROM node:20-alpine

WORKDIR /home

RUN apk add --no-cache --upgrade make bash

# Step 1: Install Dependencies Only (used for cache)
COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci

# Step 2: Copy Application Files
COPY . .
