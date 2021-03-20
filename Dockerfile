FROM node:12.19.0-alpine

WORKDIR /usr/app/server
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
CMD [ "node", "src/server.js" ]
