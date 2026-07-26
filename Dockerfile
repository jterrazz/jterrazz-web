FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

# The app chart pins runAsUser/runAsGroup/fsGroup to 1000. node:24-alpine already
# ships `node` as uid 1000 / gid 1000, so run as that rather than inventing a user.
# `content/` is not copied explicitly: Next's file tracing pulls the whole directory
# into .next/standalone (src/app/content/[...path]/route.ts reads it from
# process.cwd() at request time), so the standalone copy above already carries it.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Next writes optimized images to .next/cache at runtime. The standalone output does
# not include it, so create it up front owned by uid 1000 — otherwise every image
# optimization fails with EACCES: permission denied, mkdir '/app/.next/cache'.
RUN mkdir -p .next/cache/images && chown -R node:node .next

USER node

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

CMD ["node", "server.js"]
