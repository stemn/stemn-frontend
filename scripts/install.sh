# Install root deps
npm install

# cd into a package so our following commands line up :)
cd ./stemn-frontend-desktop

# Install desktop deps
cd ../stemn-frontend-desktop && npm i

# Install website deps
cd ../stemn-frontend-website && npm i

# Link the shared files
cd ../stemn-frontend-shared && npm link
cd ../stemn-frontend-website && npm link stemn-frontend-shared
cd ../stemn-frontend-desktop && npm link stemn-frontend-shared