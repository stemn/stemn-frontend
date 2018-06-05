# Run this from the root of stemn-frontend-desktop
cd ../stemn-frontend-shared
npm link
cd ../stemn-frontend-desktop
npm i
cd ./app
npm i
npm link stemn-frontend-shared