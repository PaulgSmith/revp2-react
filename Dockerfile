# build environment
FROM node:9.6.2-alpine as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --silent

COPY . ./
RUN npm run build
