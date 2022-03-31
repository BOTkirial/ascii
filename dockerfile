from node

COPY . /app
WORKDIR /app

RUN npm install && npm run build

CMD node ./server/index.js