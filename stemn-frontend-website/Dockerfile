FROM node:7.10-alpine

RUN apk add --update git

WORKDIR /app

ADD node_modules node_modules
ADD build build
ADD package.json .

