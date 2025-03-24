## build stage ##
FROM node:20.18.0-alpine

WORKDIR /app
COPY . .

RUN --mount=type=cache,target=/app/.cache/node_modules yarn install && yarn cache clean

COPY .env.development .env.production

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "serve" ]
