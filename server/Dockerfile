# Setup the server
FROM node:8.12-slim as server

WORKDIR /usr/app/server
COPY package*.json ./
RUN npm install 
COPY . ./
RUN npm install supervisor -g

ENTRYPOINT supervisor server.js

