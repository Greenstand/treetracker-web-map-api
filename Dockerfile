# Setup and build the client
FROM node:8.12-slim as client

WORKDIR /usr/app/client/
COPY client/package*.json ./
COPY client/ ./
RUN npm install


# Copy nginx config file
#FROM nginx:latest
#COPY --from=client /usr/app/client/nginx-reverse-proxy-web-map.conf  /etc/nginx/nginx.conf


# Setup the server
FROM node:8.12-slim as server

WORKDIR /usr/app/
COPY --from=client /usr/app/client ./client/

WORKDIR /usr/app/server
COPY server/package*.json ./
#RUN npm install -qy
RUN npm install 
COPY server/ ./
RUN npm install supervisor -g

ENTRYPOINT supervisor server.js

