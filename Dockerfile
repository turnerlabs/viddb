FROM node:6.11.1

RUN mkdir -p /usr/src/viddb
WORKDIR /usr/src/viddb

COPY package.json /usr/src/viddb/
RUN npm install

COPY . /usr/src/viddb

EXPOSE 3000
cmd ["npm", "start"]

