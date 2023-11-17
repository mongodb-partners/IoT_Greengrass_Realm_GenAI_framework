# Realm Device Sync | Greengrass | MQTT
---

## Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop/) 
* MacOS / Ubuntu

----

## Overview

Here we are building the docker image and running the container. The following container will have a C++ application that produces the messages to a topic name `topic`

Refer this container as `VEHICLE CONTAINER 1` throughout the setup.

### Instructions

```
cd infrastructure/vehicle1
```

To build the docker image. After building, his image will consist of pre-installed libraries for realm and greengrass dependencies.

```
docker build -t vehicle1 .
```

To run the docker container

```
docker run --name vehicle1 -d vehicle1
```

To view running containers

```
docker ps -a
```

To view logs of running container


```
docker logs -f container_id
```

To copy MQTT Subscriber and Device Sync code to the docker container

```
docker cp ../application/cpp <container_id>:/
```

To go inside the container

```
docker exec -it <container_id> /bin/bash
```

```
cd cpp/producer

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

cd producer

mkdir build

cmake -B build -S . -DCMAKE_BUILD_TYPE="Debug" .

cmake --build build --config Debug
```


To run the producer which will send a message to a topic `topic` This message will be consumed by the consumer in `CONSUMER CONTAINER`

```
build/producer
```
