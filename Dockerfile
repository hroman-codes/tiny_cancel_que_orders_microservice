# syntax=docker/dockerfile:1

FROM node:14.18.0

ARG NODE_ENV

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]

