
if [ "$CIRCLE_BRANCH" == "production" ]
then 
  echo hello 
  # gcloud container clusters get-credentials stemn-beta-2018-07-01-12-09-50 --zone us-west1-c --project stemnapp
else
  gcloud container clusters get-credentials staging-development --zone us-east1-b --project stemnapp
fi

echo "${CIRCLE_BRANCH} - Update Website"

cd ~/stemn-frontend/stemn-frontend-website

IMAGE="gcr.io/stemnapp/${CIRCLE_BRANCH}/stemn-website-server"

docker build -t "${IMAGE}:${CIRCLE_BUILD_NUM}" .
docker build -t "${IMAGE}":latest .

docker push "${IMAGE}:$TAG"
docker push "${IMAGE}:latest"

kubectl set image deployment/website website="${IMAGE}:$TAG"  

echo ---------------------------