FROM node:8.12-slim

ENV DIR /opt/map-api-server
RUN mkdir -p ${DIR}/

WORKDIR $DIR

RUN npm install supervisor -g

ENTRYPOINT supervisor server.js
