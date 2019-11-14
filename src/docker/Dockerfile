FROM nginx
LABEL version="0.0.1-SNAPSHOT"
LABEL description="XM^online webapp"
MAINTAINER Ihor Shkurko <ishkurko@gmail.com>
EXPOSE 80 19999
RUN apt-get update && apt-get install -y locales locales-all
ADD proxy_params /etc/nginx/
ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8 \
    TERM=xterm \
    TZ=Europe/Kiev \
    GATE_HOST=gate-app \
    GATE_PORT=8080 \
    BE_ENDPOINTS="v2\|management\|api\|uaa\|audit\|document\|config\/\(api\|v2\|management\)\|entity\|dashboard\/\(api\|v2\|management\)\|timeline\|balance\|wallet\|zendesk\|escrow\|ldb\|otp\|communication\|hlr\|customer\|scheduler\|stp\|activation\|foris\|websocket\|swagger-resources\|publicregistry"
ADD entrypoint.sh /
ENTRYPOINT /entrypoint.sh
ADD ./dist /var/www
RUN chown -R nginx:nginx /var/www && chmod 755 /entrypoint.sh
ADD nginx.tmpl /etc/nginx/
