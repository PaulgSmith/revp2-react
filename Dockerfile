# build environment
FROM node:18.14.2-alpine as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .
RUN npm run build

# production environment
FROM nginx:1.21-alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file to the container
COPY nginx.conf /etc/nginx/conf.d/

# Copy the built React app from the previous stage to the container
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

