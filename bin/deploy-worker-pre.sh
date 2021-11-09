#!/bin/bash
# Note: assumes it is executed from the project root folder!

ENV="worker-pre"

echo 'Building APP ... be patient and be HAPPY ...'

cd ../CookDesignAPI
cp -r * ../CookDesignWorkerDeploy/

cd ../CookDesignWorkerDeploy
git add -A .
git commit -m "Update for deploy"

echo "Deploying app to Amazon EB, environment: $ENV"
eb deploy $ENV

echo "Done !!!!"