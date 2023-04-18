# build environment
FROM node:13.12.0-alpine as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

WORKDIR /app

RUN npm ci --silent
RUN npm install react-scripts@5.0.1 -g

COPY . ./
RUN npm run build
