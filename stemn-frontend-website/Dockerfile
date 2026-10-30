# syntax=docker/dockerfile:1
# Stemn website: production build served by the express server (src/server).
# Build from the repository root (the website needs the pnpm workspace):
#   docker build -f stemn-frontend-website/Dockerfile --build-arg STEMN_ENV=staging -t stemn-website .
#   docker run -p 8081:8081 stemn-website

FROM node:24-bookworm-slim AS build
WORKDIR /app
# pnpm, the version in package.json "packageManager" (corepack)
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
# pnpm fetch needs only the lockfile and the workspace settings, so the download layer is cached
# until pnpm-lock.yaml changes (no per-package package.json copies)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store pnpm fetch --store-dir /pnpm-store
COPY . .
# No lifecycle scripts: skips the git hooks (the Electron binary is never downloaded by an install)
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
    pnpm install --frozen-lockfile --prefer-offline --ignore-scripts --store-dir /pnpm-store
ARG STEMN_ENV=production
ARG SENTRY_DSN=
ARG API_SERVER
ARG WEBSITE_URL
ARG WEBSOCKET_SERVER
RUN pnpm run build
# The server's runtime dependencies at the versions the lockfile installed (+ the pnpm version)
RUN cd stemn-frontend-website && node -e "const v = (name) => require(name + '/package.json').version; \
    const { packageManager } = require('../package.json'); \
    require('fs').writeFileSync('/app/server-package.json', JSON.stringify({ private: true, packageManager, dependencies: { express: v('express'), morgan: v('morgan') } }))"

FROM node:24-alpine AS runtime
ENV NODE_ENV=production PORT=8081
WORKDIR /app
# Only the server's runtime dependencies (express + morgan, versions from the build stage)
COPY --from=build /app/server-package.json ./package.json
RUN corepack enable && COREPACK_ENABLE_DOWNLOAD_PROMPT=0 pnpm install --prod \
  && rm -rf /root/.cache /root/.local/share/pnpm && corepack disable
COPY --from=build /app/stemn-frontend-website/build ./build
USER node
EXPOSE 8081
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:${PORT}/api/ping || exit 1
CMD ["node", "build/server/index.js"]
