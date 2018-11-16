FROM node:8.11-slim

ENV DIR /opt/server/
RUN mkdir -p $DIR

COPY package*.json index.js $DIR

WORKDIR $DIR
RUN set -ex && npm config set registry http://registry.npmjs.org/ && npm install --loglevel=verbose

ENTRYPOINT node index.js
