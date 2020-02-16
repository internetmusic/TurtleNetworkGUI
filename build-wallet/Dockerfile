#FROM node:lts-alpine as trading-view-${jenkinsPlatform}
#ARG trading_view_token
#WORKDIR /root
#RUN echo "//registry.npmjs.org/:_authToken=\$trading_view_token" > /root/.npmrc && \
#    npm i @waves/trading-view

FROM node:lts-alpine as static-VERSION-NUMBER
RUN apk update && apk add git
ARG platform=web

COPY ./TurtleNetworkGUI/ /srv/www/TurtleNetworkGUI/
WORKDIR /srv/www/TurtleNetworkGUI
RUN npm ci --unsafe-perm && \
    node_modules/.bin/gulp build --platform \web --config ./configs/testnet.json && \
    mv ./dist/\web/testnet ./testnet && \
    node_modules/.bin/gulp build --platform \web --config ./configs/stagenet.json && \
    mv ./dist/\web/stagenet ./stagenet && \
    node_modules/.bin/gulp build --platform \web --config ./configs/mainnet.json && \
    mv ./testnet ./dist/\web/testnet  && \
    mv ./stagenet ./dist/\web/stagenet
RUN rm -rf /srv/www/TurtleNetworkGUI/node_modules/

FROM nginx:stable-alpine
ARG platform=web
ARG web_environment=testnet
ENV WEB_ENVIRONMENT=\$web_environment
#ENV PLATFORM=\$platform
ENV PLATFORM=web

RUN  mkdir -p /etc/nginx/sites-enabled && \
    apk update && \
    apk add gettext libintl
WORKDIR /srv/www
#COPY --from=trading-view-${jenkinsPlatform} /root/node_modules node_modules
COPY --from=static-VERSION-NUMBER /srv/www .
COPY ./TurtleNetworkGUI/build-wallet/nginx/default.conf /etc/nginx/sites-available/default.conf
#COPY ./info.html /srv/www/info
COPY ./TurtleNetworkGUI/build-wallet/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./TurtleNetworkGUI/build-wallet/files/ /srv/www/TurtleNetworkGUI/dist/web/mainnet/
EXPOSE 80

CMD ["/bin/sh","-c", "envsubst '\${WEB_ENVIRONMENT}' < /etc/nginx/sites-available/default.conf > /etc/nginx/sites-enabled/\${PLATFORM}-\${WEB_ENVIRONMENT}.conf ; envsubst '\${WEB_ENVIRONMENT}' < /srv/www/info > /srv/www/info.html ; nginx -g 'daemon off;'"]
