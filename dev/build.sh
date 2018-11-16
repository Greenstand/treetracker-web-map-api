#!/bin/bash

docker build . -f dev/Dockerfile.ReverseProxy -t treetracker-map-reverse-proxy:latest
docker build . -f dev/Dockerfile.API -t treetracker-map-api:latest

