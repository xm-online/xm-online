#!/bin/bash
resolver=`grep  nameserver /etc/resolv.conf | head -1 | cut -d ' ' -f 2`
sed -e "s/{{be_host}}/$GATE_HOST/g" -e "s/{{be_port}}/$GATE_PORT/g" \
    -e "s/{{be_endpoints}}/$BE_ENDPOINTS/g" \
    -e "s/resolver.*/resolver $resolver valid=10s;/g" /etc/nginx/nginx.tmpl > /etc/nginx/nginx.conf

nginx -g 'daemon off;'
