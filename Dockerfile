FROM node:12
ENV YARN_VERSION 1.22.4

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 8080
CMD [ "yarn", "run", "start" ]