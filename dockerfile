FROM node:latest


RUN mkdir -p /app

WORKDIR /app


COPY package.json /app

RUN npm install


COPY . /app
RUN rm -rf /app/db/

CMD ["node", "index.js"]