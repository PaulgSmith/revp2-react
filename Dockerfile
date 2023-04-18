# build environment
FROM node:18.14.2-alpine as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . ./
RUN npm run build
