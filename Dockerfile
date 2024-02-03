FROM node:18-alpine as build
MAINTAINER Saprin Alexey
LABEL version="2.0.0"
WORKDIR /app


COPY package*.json ./
RUN npm install
COPY . .
RUN cd /app/vue-3dp \
    && npm install \
    && npm run build \
    && cp dist/index.html /app/ \
    && mkdir /app/js \
    && mkdir /app/css \
    && cp dist/js/* /app/js \
    && cp dist/css/* /app/css \
    && cd ../

EXPOSE 26543 3000
CMD ["npm", "run", "start"]
