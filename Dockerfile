FROM node:lts-alpine as static-temp
RUN apk update && apk add git

COPY ./ /srv/www/TurtleNetworkGUI/
WORKDIR /srv/www/TurtleNetworkGUI
RUN mkdir -p /srv/www/TurtleNetworkGUI/dist/web/testnet/

ARG platform=web
RUN npm ci --unsafe-perm && \
    node_modules/.bin/gulp build --platform web --config ./configs/testnet.json

RUN mkdir -p /srv/www/TurtleNetworkGUI/dist/web/testnet/trading-view

# COPY ./vendors/trading-view/ /srv/www/TurtleNetworkGUI/dist/web/testnet/trading-view/

#RUN npm run build
#COPY ./dist/web/testnet ./dist/web/testnet/

FROM nginx:stable-alpine
#ARG web_environment=mainnet
#ARG platform=web
ENV WEB_ENVIRONMENT=testnet
ENV PLATFORM=web

RUN  mkdir -p /etc/nginx/sites-enabled && \
    apk update && \
    apk add gettext libintl

WORKDIR /srv/www
COPY ./build-wallet/nginx/default.conf /etc/nginx/sites-available/default.conf
#COPY ./build-wallet/info.html /srv/www/info
COPY ./build-wallet/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=static-temp /srv/www/TurtleNetworkGUI/dist/web/testnet/ /srv/www/TurtleNetworkGUI/dist/web/testnet/
EXPOSE 80

CMD ["/bin/sh","-c", "envsubst 'testnet' < /etc/nginx/sites-available/default.conf > /etc/nginx/sites-enabled/web-testnet.conf ; nginx -g 'daemon off;'"]
