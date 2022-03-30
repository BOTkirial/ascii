from node

COPY . /app
WORKDIR /app

RUN npm install && npm run build && node ./server/index.js