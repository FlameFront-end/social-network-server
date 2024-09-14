FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN yarn start:dev

COPY . .

RUN yarn build

COPY ./dist ./dist

CMD ["yarn", "start:dev"]
