# Install root deps
npm ci

# Install desktop deps
yarn --cwd stemn-frontend-desktop install:all

# Install website deps
cd stemn-frontend-website && npm ci && cd ..

# Install shared deps
cd stemn-frontend-shared && npm ci && cd ..
