# Run this relative to stemn-frontend-website
# GIT_SSH env var must be set in CI
git clone git@github.com:stemn/stemn-website-server.git
git config --global user.email "ci@stemn.com";
git config --global user.name "Stemn CI"
cd ./stemn-website-server
rm -rf ./src/client
cp -R ../build/client ./src/client
git add .
git commit -m "Automated Deployment"
git push origin master