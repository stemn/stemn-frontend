# Install root deps
npm install --no-save

# Install website deps
npm run install:all --prefix stemn-frontend-website --no-save

# Install shared deps
npm install --prefix stemn-frontend-shared --no-save
