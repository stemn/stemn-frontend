FROM node:alpine

RUN apk add --update git

WORKDIR /app
ADD package.json .
ADD src src
RUN yarn install --production
