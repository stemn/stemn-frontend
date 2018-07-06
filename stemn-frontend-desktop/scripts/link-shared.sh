# Run this from the root of stemn-frontend-website
cd ../stemn-frontend-shared
npm link
cd ../stemn-frontend-desktop
npm link stemn-frontend-shared
cd ./app
npm link stemn-frontend-shared