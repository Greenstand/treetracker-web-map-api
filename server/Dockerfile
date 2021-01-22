# Setup the server
FROM node:12.19.0-alpine

WORKDIR /usr/app/server
COPY package*.json ./
RUN npm install 
COPY . ./
RUN npm install supervisor -g

ENTRYPOINT supervisor server.js

