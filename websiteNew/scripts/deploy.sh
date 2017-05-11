#!/bin/bash
#echo "------------------------ Build the dist version ------------------------"
#npm run build
echo "------------------- Copying dist to website live repo ------------------"
cd ../../../stemn-website-live
git pull
cp -r ../stemn-frontend/websiteNew/build/client .
echo "---------------------- Pushing releases to repo -----------------------"
git add .
git commit -am 'release'
git push
echo "---------------- Push, complete. Time to SSH and pull------------------"
