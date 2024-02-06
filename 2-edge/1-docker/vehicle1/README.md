# C++ | MQTT
---

## Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop/) 
* MacOS / Ubuntu

----

## Overview

Here we are building the docker image and running the container. The following container will have a C++ application that produces the messages to a topic name `topic`

Refer to this container as `VEHICLE CONTAINER 1` throughout the setup.

### Instructions

Move to the directory /2-edge/1-docker/vehicle1
```
cd ../vehicle1 
```

To build the docker image. After building, his image will consist of pre-installed libraries for realm and greengrass dependencies.

```
docker build -t vehicle1 .
```

To run the docker container

```
docker run -e VEHICLE_ID=<VEHICLE_ID> --name vehicle1 -d vehicle1
```

To view running containers

```
docker ps -a
```

At this point, all the 3 docker containers should be up and running as shown in the sample screenshot below

<img width="999" alt="image" src="https://github.com/mongodb-partners/IoT_Greengrass_Realm_GenAI_framework/assets/101570105/da06f069-dbef-4a41-95d8-a52ea6b97ef9">



To view logs of running container


```
docker logs -f container_id
```

To copy the MQTT Subscriber and Device Sync code to the vehicle1 docker container

```
docker cp ../../2-edge/cpp/producer <container_id>:/
```

To go inside the container

```
docker exec -it <container_id> /bin/bash
```

```
cd /producer

mkdir build

cmake -B build -S . -DCMAKE_BUILD_TYPE="Debug" .

cmake --build build --config Debug
```


To run the producer which will send a message to a topic `topic` This message will be consumed by the mqtt consumer in `CONSUMER CONTAINER`

```
build/producer
```

On successful completion , the message should be generated as shown in the below screenshot

<img width="385" alt="image" src="https://github.com/mongodb-partners/IoT_Greengrass_Realm_GenAI_framework/assets/101570105/22516544-42c2-4098-9bb8-6cd0a7f62561">



Congratulations!! You have almost completed the edge setup. Move next to [Deploy MQTT Consumer to Edge Gateway](../../2-edge/cpp/consumer/README.md).

