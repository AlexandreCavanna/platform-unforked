#!/bin/bash

if [ "$PRODUCTION" ]; then
  echo "Building for production"
  # Symfony deps
  composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader --no-scripts
  mkdir -p var
  php vendor/sensio/distribution-bundle/Sensio/Bundle/DistributionBundle/Resources/bin/build_bootstrap.php var

  # Frontend deps
  npm --quiet --no-color install --production
  #npm rebuild node-sass
  bower install --config.interactive=false --allow-root --config.storage.cache=/home/capco/.cache/bower
  NODE_ENV=production npm run build:prod
else
  echo "Building for development"
  # Symfony deps
  composer install --prefer-dist --no-interaction --no-scripts

  # Frontend deps
  npm install
  npm rebuild node-sass
  bower install --config.interactive=false --config.storage.cache=/home/capco/.bower
  npm run build
fi
