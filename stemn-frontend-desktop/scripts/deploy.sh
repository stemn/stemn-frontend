# Run this script from the `stemn-frontend-desktop` folder
# This will copy the dist to the 'stemn-desktop' repo where it will be compiled 
# into the executables.

git config --global user.email = "ci@stemn.com"
git config --global user.name = "Stemn CI"
cd ../../
git clone git@github.com:stemn/stemn-desktop.git
cd stemn-desktop
rm -rf ./dist
rm -rf ./build
cp -r ../stemn-frontend/stemn-frontend-desktop/dist .
cp -r ../stemn-frontend/stemn-frontend-desktop/build .
cp -r ../stemn-frontend/stemn-frontend-desktop/package.json .
git add .
git commit -am "Automated Deployment: $CIRCLE_BRANCH $CIRCLE_BUILD_NUM"
git push
