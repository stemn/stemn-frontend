# Install root deps
npm install --no-save

# Install desktop deps
npm run install:all --prefix stemn-frontend-desktop --no-save

# Install shared deps
npm install --prefix stemn-frontend-shared --no-save
