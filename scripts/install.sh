# Install root deps
npm install

# cd into a package so our following commands line up :)
cd ./stemn-frontend-desktop

# Install desktop deps
cd ../stemn-frontend-desktop && npm run install:link

# Install website deps
cd ../stemn-frontend-website && npm run install:link
