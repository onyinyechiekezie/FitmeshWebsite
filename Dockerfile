# Multi-stage Dockerfile for Next.js (pnpm)
# Base image with pnpm via Corepack
FROM node:20-alpine AS base

# Improve compatibility for native deps (e.g., sharp)
RUN apk add --no-cache libc6-compat

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Install dependencies using cached layer
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
# Use non-frozen lockfile to avoid failing when lock is stale
RUN pnpm install --no-frozen-lockfile

# Build the application
FROM base AS builder
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Ignore network errors when downloading Google Fonts during build
ENV NEXT_FONT_IGNORE_NETWORK_ERRORS=1

# Reuse installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Build Next.js (produces .next)
RUN pnpm build

# Production runtime image
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy only what is needed to run the app
# 1) Production dependencies
COPY package.json pnpm-lock.yaml ./
COPY --from=deps /app/node_modules ./node_modules
# Prune devDependencies to slim runtime
RUN pnpm prune --prod

# 2) Next build artifacts and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Optionally copy middleware and any other runtime-needed config (safe if absent at runtime)
# COPY --from=builder /app/middleware.ts ./middleware.ts

EXPOSE 3000

# Use Next.js start script (reads PORT env)
CMD ["pnpm", "start"]




# FROM node:20-slim AS base
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# COPY . /app
# WORKDIR /app

# FROM base AS prod-deps
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# FROM base AS build
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm run build

# FROM base
# COPY --from=prod-deps /app/node_modules /app/node_modules
# COPY --from=build /app/dist /app/dist
# EXPOSE 8000
# CMD [ "pnpm", "start" ]