FROM node:14.15.5-alpine3.13 as builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY ./package.json ./
COPY ./package-lock.json ./

COPY . ./

EXPOSE 5000

RUN npm install

CMD ["npm", "run", "stable"]
