# build environment
FROM node:14.15.5-alpine3.13 as builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

COPY . ./

RUN npm install && npm run-script build


#Nginx
FROM nginx:stable-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/proxy.nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
