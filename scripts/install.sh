# Install root deps
npm ci

# Install website deps
yarn --cwd stemn-frontend-desktop install:all

# Install website deps
cd stemn-frontend-website && npm ci
