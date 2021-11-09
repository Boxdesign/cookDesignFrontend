#!/bin/bash
# Note: assumes it is executed from the project root folder!

# set -e
ENV="cookdesign-prod"

# usage() { echo "Usage: $0 [-e <eb_environment:string>=staging]" 1>&2; exit 1; }
# while getopts ":e:" opt; do
# 	case $opt in
# 		e)
# 			ENV=$OPTARG
# 			;;
# 		\?)
# 			echo "Invalid option: -$OPTARG" >&2
# 			usage
# 			;;
# 	esac
# done

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
git add -A .
git commit -m "Update for deploy"

echo "Deploying app to Amazon EB, environment: $ENV"
eb deploy $ENV

echo "Done !!!!"