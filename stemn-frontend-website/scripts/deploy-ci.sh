# git clone https://${GITHUB_TOKEN}@github.com/stemn/stemn-website-server.git
# git config --global user.email "ci@stemn.com";
# git config --global user.name "Stemn CI"
# cd ./stemn-website-server
# rm -rf ./src/client
# cp -R ../build/client ./src/client
# git add .
# git commit -m "Automated Deployment: $TRAVIS_BUILD_NUMBER"
# git push origin master
