FROM nginx

COPY . /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

RUN apt-get update && apt-get install -y curl \
    && curl --silent --location https://deb.nodesource.com/setup_12.x | bash - \
    && apt-get install -y nodejs \
    && npm install --no-optional && npm cache clean --force \
    && npm run build \
    && rm -r .cache node_modules src \
    && mv -v /usr/share/nginx/html/public/* /usr/share/nginx/html \