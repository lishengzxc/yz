FROM node
EXPOSE 8888
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
ENTRYPOINT node server.js