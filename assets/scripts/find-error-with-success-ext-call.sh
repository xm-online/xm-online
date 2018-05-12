#!/bin/sh

d=`date +%F' '%R`

e=`cat $1 | egrep "$d"| egrep "ERROR" | awk 'BEGIN{FS=" "} {print $5}'| awk 'BEGIN{FS=":"; RS="\["; ORS=""} {print $1}'`

b=`cat $1 |egrep $e |egrep "SUCCESS EXT CALL" | awk 'BEGIN{FS=" "} {print $5}'| awk 'BEGIN{FS=":"; RS="\["; ORS=""} {print $1}'`

echo $b
