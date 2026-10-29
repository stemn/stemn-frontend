# syntax=docker/dockerfile:1
# Stemn website: production build served by the express server (src/server).
# Build from the repository root (the website needs the npm workspace):
#   docker build -f stemn-frontend-website/Dockerfile --build-arg STEMN_ENV=staging -t stemn-website .
#   docker run -p 8081:8081 stemn-website

FROM node:24-bookworm-slim AS build
WORKDIR /app
# Workspace manifests first, so the dependency layer is cached until they change
COPY package.json package-lock.json .npmrc ./
COPY stemn-frontend-website/package.json stemn-frontend-website/
COPY stemn-frontend-shared/package.json stemn-frontend-shared/
COPY stemn-frontend-desktop/package.json stemn-frontend-desktop/
COPY tests/e2e/package.json tests/e2e/
# No lifecycle scripts: skips the Electron download and the git hooks
RUN npm ci --no-audit --no-fund --ignore-scripts
COPY . .
ARG STEMN_ENV=production
ARG SENTRY_DSN=
ARG API_SERVER
ARG WEBSITE_URL
ARG WEBSOCKET_SERVER
RUN npm run build

FROM node:24-alpine AS runtime
ENV NODE_ENV=production PORT=8081
WORKDIR /app
# Only the server's runtime dependencies (versions from the website package.json)
COPY stemn-frontend-website/package.json /tmp/website-package.json
RUN node -e "const d = require('/tmp/website-package.json').dependencies; \
    require('fs').writeFileSync('package.json', JSON.stringify({ private: true, dependencies: { express: d.express, morgan: d.morgan } }))" \
  && npm install --omit=dev --no-audit --no-fund \
  && npm cache clean --force \
  && rm /tmp/website-package.json
COPY --from=build /app/stemn-frontend-website/build ./build
USER node
EXPOSE 8081
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:${PORT}/api/ping || exit 1
CMD ["node", "build/server/index.js"]
