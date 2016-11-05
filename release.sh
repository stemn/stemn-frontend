#!/bin/bash

echo "-------------------- Pushing source to private repo --------------------"
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
git commit -am 'release'
git push
echo "------------------- Push, complete. CI is building --------------------"