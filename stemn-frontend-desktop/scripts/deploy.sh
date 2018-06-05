# Run this script from the `stemn-frontend-desktop` folder
echo "-------------------- Pushing source to this repo ----------------------"
git config --global core.safecrlf false
git add .
git commit -m 'release'
git push
echo "------------------- Copy dist to stemn-desktop repo -------------------"
cd ../../stemn-desktop
git pull
rm -rf ./dist
rm -rf ./build
cp -r ../stemn-frontend/stemn-frontend-website/dist .
cp -r ../stemn-frontend/stemn-frontend-website/build .
cp -r ../stemn-frontend/stemn-frontend-website/package.json .
echo "-------------- Commit changes to the stemn-desktop repo ---------------"
git config --global core.safecrlf false
git add .
git commit -am 'release'
git push
echo "------------------- Push, complete. CI is building --------------------"
