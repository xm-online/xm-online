#!/bin/bash

if ! [[ $1 =~ ^[0-9]+$ ]];
    then 
        echo "Entity ID is required";
        exit 1
    else 
        echo "Updating entity [$1]"
fi
if ! [[ $2 ]];
    then 
        echo "Base url is required";
        exit 1
    else 
        echo "On URL [$2]"
fi
entity_id=$1 # 1
base_url=$2 # http://xm.test.xm-online.com

client_id=<internal>
client_secret=<internal>
username=<user>
password=<pwd>

oauth=$(curl -u $client_id:$client_secret -X POST -d "grant_type=password&username=$username&password=$password" $base_url/uaa/oauth/token)
echo "Got oauth: $oauth"

token=$(echo $oauth | grep '"access_token":' | head -1 | cut -d ':' -f 2 | cut -d '"' -f 2)
echo "Got token: $token"

before=$(curl --header "Authorization: Bearer $token" $base_url/entity/api/xm-entities/$entity_id)
echo "Got entity: $before"

after=$(curl --header "Authorization: Bearer $token" --header "Content-Type: application/json; charset=UTF-8" -X PUT --data "$before" $base_url/entity/api/xm-entities)
echo "Updated entity: $after"
