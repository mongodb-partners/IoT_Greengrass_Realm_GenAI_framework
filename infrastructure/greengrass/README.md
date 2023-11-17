# Realm Device Sync | Greengrass | MQTT
--- 

## Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop/) 
* MacOS / Ubuntu

----

## Overview

Here we are building the docker image and running the container which will have pre-installed dependency libraries for Realm and Greengrass.

The following container will have a C++ application that listens for the messages from a topic name `topic` and will parse and save the message received in it to Realm local database, which then sync to Atlas via Device sync in real-time.

This is the whole purpose of this container to host a C++ application and listen for the messages in the topic `topic`.

Refer this container as `CONSUMER CONTAINER` throughout the setup.

### Instructions

```
git clone <repo_url>

cd <repo>

cd infrastructure/greengrass
```

To build the docker image. After building, his image will consist of pre-installed libraries for realm and greengrass dependencies.

```
docker build -t realmgreengrass .
```

 * **Note**: If you want to provision the device upon startup for cloud deployments, you will need to add the following lines to your docker-compose file to mount your AWS credentials into the container to be picked up at `/root/.aws/credentials` . Ensure that the `:ro` suffix is present at the end of the command to ensure read-only access. (This will build image use long-term credentials from an IAM user). 
 
```
environment:  
 - PROVISION=true
volumes:  
 - /path/to/credential/directory/:/root/.aws/:ro
```

For more information [Refer here](https://github.com/aws-greengrass/aws-greengrass-docker/blob/main/README.md)


To run the docker container

```
docker-compose -f docker-compose.yml up -d
```

To view running containers

```
docker ps -a
```

To view logs of running container

```
docker logs -f container_id
```

To copy MQTT Consumer and Device Sync code to the docker container

```
docker cp ../application/cpp <container_id>:/
```

To go inside the container

```
docker exec -it <container_id> /bin/bash
```

```
cd cpp/consumer

mkdir lib

cd lib

git clone https://github.com/eclipse/paho.mqtt.cpp

cd paho.mqtt.cpp

git clone https://github.com/eclipse/paho.mqtt.c.git

cd paho.mqtt.c

git checkout v1.3.8

cmake -Bbuild -H. -DPAHO_ENABLE_TESTING=OFF -DPAHO_BUILD_STATIC=ON \
    -DPAHO_WITH_SSL=ON -DPAHO_HIGH_PERFORMANCE=ON

cmake --build build/ --target install

ldconfig

cd ..

cmake -Bbuild -H. -DPAHO_BUILD_STATIC=ON -DPAHO_BUILD_DOCUMENTATION=TRUE -DPAHO_BUILD_SAMPLES=TRUE

cmake --build build/ --target install

ldconfig

cd ..

cd consumer

mkdir build

cmake -B build -S . -DCMAKE_BUILD_TYPE="Debug" .

cmake --build build --config Debug
```


To run the consumer 

```
build/consumer
```

Keep this running in one terminal. Now follow the process mentioned in `README.md` inside `vehicle1` directory