#!/bin/bash
# Note: assumes it is executed from the project root folder!

ENV="cookdesign-pre"

echo 'Building APP ... be patient and be HAPPY ...'

cd ../CookDesignAPI
cp -r * ../CookDesignDeploy/

cd ../CookDesignWeb
#node --max-old-space-size=5000 ./node_modules/.bin/ng build --prod

cd dist
rm -rf ../../CookDesignDeploy/public/*
cp -r * ../../CookDesignDeploy/public/
cd -

cd ../CookDesignDeploy
git add .
git commit -m "Update for deploy"

echo "Deploying app to Amazon EB, environment: $ENV"
eb deploy $ENV

echo "Done !!!!"
