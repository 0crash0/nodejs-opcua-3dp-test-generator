FROM node:17-alpine as build
MAINTAINER Saprin Alexey
LABEL version="1.2.1"
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 26543 3000
CMD ["npm", "run", "start"]
