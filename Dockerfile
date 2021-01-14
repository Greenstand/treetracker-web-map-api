# Setup and build the client
FROM FROM node:12.19.0-alpine as client

WORKDIR /usr/app/client/
COPY client/package*.json ./
COPY client/ ./
RUN npm ci


# Setup the server
FROM FROM node:12.19.0-alpine as server

WORKDIR /usr/app/
COPY --from=client /usr/app/client ./client/

WORKDIR /usr/app/server
COPY server/package*.json ./
#RUN npm install -qy
RUN npm ci 
COPY server/ ./
RUN npm install supervisor -g

ENTRYPOINT supervisor server.js

