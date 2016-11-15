#!/bin/bash
echo "------------------------ Build the dist version ------------------------"
npm run build
echo "-------------------- Pushing source to private repo --------------------"
git config --global core.safecrlf false
git add .
git commit -m 'release'
git push
echo "-------------------- Copying dist to releases repo --------------------"
cd ../stemn-desktop-release
git pull
cp -r ../stemn-electron/dist .
cp -r ../stemn-electron/build .
cp ../stemn-electron/package.json .
echo "---------------------- Pushing releases to repo -----------------------"
git config --global core.safecrlf false
git commit -am 'release'
git push
# xdg-open https://github.com/Stemn/Stemn-Desktop/releases
# xdg-open https://travis-ci.org/Stemn/Stemn-Desktop
# xdg-open https://ci.appveyor.com/project/MrBlenny/stemn-desktop
echo "------------------- Push, complete. CI is building --------------------"