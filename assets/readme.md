# Install XM^Online 2 using Docker

[![N|Solid](https://avatars2.githubusercontent.com/u/32478295?s=100&v=4)](https://nodesource.com/products/nsolid)


To install XM^Online 2 on docker, first you need to have installed Docker v17.06+ . For installation follow its official documentation.

And clone this project and make git clone --mirror project xm2-config
 ```sh
$ git clone https://github.com/xm-online/xm-online.git 
```
  - andmake git clone --mirror project xm2-config
 ```sh
$ git clone --mirror https://github.com/xm-online/xm-ms-config-repository.git
```

On the project path where XM^Online2 is cloned, run docker up to start containers defined.
  - start swarm for work docker stack
 ```sh
$ docker swarm init
```
  - start service XM^Online2
 ```sh
cd assets/ 
```
 ```sh
$ docker stack deploy -c docker-compose.yml xm2local
```
If it is the first time you are using those images, it will first download the images from hub which may take some time.

If nothing goes wrong you should see a couple of containers are running on your machine. To see them you can type: 

 ```sh
$ docker ps
$ docker service ls
```
In this example, we simply map port 10080 of the host to port 80 of the Docker (or whatever port was exposed in the docker-compose.yml)
Verify the deployment by navigating to your server address in your preferred browser. 
 ```sh
 localhost:80 
 ```
or 
 ```sh
 <ip>:80 
 ```

The ports of all the services like Postgresql, Kafka etc. were intentionally changed to custom ones to not to conflict with the default ones that may be installed and running on machine. For example, to connect to Postgresql here is the credentials:
 ```sh
postgresql:
        image: postgres:9.6.2
        networks:
            - xm2
        ports:
            - 5432:5432
        volumes:
            - ./:/docker-entrypoint-initdb.d/
        environment:
            - POSTGRES_USER=postgres
            - POSTGRES_PASSWORD=postgres
        deploy:
            mode: replicated
            replicas: 1
            restart_policy:
                condition: on-failur
```
To get credentials of other services you may want to see docker-compose.yml and docker logs 
# Debugging
For debugging you can open logs service 
 ```sh
$ docker service logs {SERVICE_ID}
```
Sometimes you may need to bash into a specific container for debugging purposes. To do that:
 ```sh
$ docker exec -it {CONTAINER_ID} bash
```

