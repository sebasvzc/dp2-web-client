#!/bin/bash
sudo systemctl stop nginx
echo "Building app..."
sudo rm -r dist/*
yarn build
echo "Deploying files to Server..."
sudo rm -r /var/www/html/*
sudo cp -r dist/* /var/www/html
echo "Done!"
sudo systemctl start nginx
