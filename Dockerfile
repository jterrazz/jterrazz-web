FROM node:20-alpine

WORKDIR /home

RUN apk add --no-cache --upgrade make bash

# Step 1: Install Dependencies Only (used for cache)
COPY package*.json ./
RUN npm ci --production

# Step 2: Copy only necessary files
COPY src ./src
COPY public ./public
COPY next.config.js .
COPY tsconfig.json .
COPY postcss.config.js .
COPY tailwind.config.ts .

# Step 3: Build Application
RUN npm run build

# Step 4: Clean development dependencies
RUN npm prune --production

# Step 5: Run Application
CMD ["npm", "start"]