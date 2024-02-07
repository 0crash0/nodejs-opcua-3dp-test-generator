FROM node:18-alpine as build
WORKDIR /app
COPY ./vue-3dp/package*.json ./
RUN npm install
COPY ./vue-3dp/. /app
RUN npm run build

FROM node:18-alpine
MAINTAINER Saprin Alexey
LABEL version="2.0.3"



WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir /app/js \
    && mkdir /app/css

COPY --from=build /app/dist/index.html .
COPY --from=build /app/dist/js/. ./js
COPY --from=build /app/dist/css/. ./css



EXPOSE 26543 $NODE_PORT
CMD ["npm", "run", "start"]
