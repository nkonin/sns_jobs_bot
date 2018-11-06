FROM node:8

WORKDIR /app
COPY . .

RUN npm install --global yarn

RUN yarn
RUN yarn build

CMD node ./build/bot.js

