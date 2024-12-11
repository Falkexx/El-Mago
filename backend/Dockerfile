FROM node:18-alpine AS base

WORKDIR /backend/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000