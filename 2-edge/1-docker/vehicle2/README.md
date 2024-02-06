# C++ | MQTT
---

## Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop/) 
* MacOS / Ubuntu

----

## Overview

Here we are building the docker image and running the container. The following container will have a C++ application that produces the messages to a topic name `topic`

Refer this container as `VEHICLE CONTAINER 2` throughout the setup.

### Instructions

```
cd docker/vehicle2
```

To build the docker image. After building, his image will consist of pre-installed libraries for realm and greengrass dependencies.

```
docker build -t vehicle2 .
```

To run the docker container

```
docker run -e VEHICLE_ID=<VEHICLE_ID> --name vehicle2 -d vehicle2

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

mkdir build

cmake -B build -S . -DCMAKE_BUILD_TYPE="Debug" .

cmake --build build --config Debug
```


To run the producer which will send a message to a topic `topic` This message will be consumed by the mqtt consumer in `CONSUMER CONTAINER`

```
build/producer
```
