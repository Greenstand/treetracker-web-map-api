# Setup the server
FROM FROM node:12.19.0-alpine as server

WORKDIR /usr/app/server
COPY package*.json ./
RUN npm install 
COPY . ./
RUN npm install supervisor -g

ENTRYPOINT supervisor server.js

