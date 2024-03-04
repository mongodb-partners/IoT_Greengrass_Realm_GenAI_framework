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


Insert a document into the Vehicle collection of fleet_db database. Note down the _id for future reference.


sample document:  

    {"_id": "65e09427028c72731d009fae", "make": "Toyota", "model": "Camry", "vin": "1HGCM82633A004352"}



<img width="936" alt="image" src="https://github.com/mongodb-partners/IoT_Greengrass_Realm_GenAI_framework/assets/101570105/ef8514c1-a3e8-4301-97e1-4ef241397ac2">




Move to the directory /2-edge/1-docker/vehicle1
```
cd ../vehicle1 
```

To build the docker image. After building, his image will consist of pre-installed libraries for the realm and greengrass dependencies.

```
docker build -t vehicle1 .
```

To run the docker container. Ensure the VEHICLE_ID is the same as the _id of the Vehicle collection inserted in the first step.

```
docker run -e VEHICLE_ID=<_id> --name vehicle1 -d vehicle1
```

Example: for the above document inserted in step1 the command is ``` docker run -e VEHICLE_ID="65e09427028c72731d009fae" --name vehicle1 -d vehicle1 ```

To view running containers

```
docker ps -a
```

At this point, all the 3 docker containers should be up and running as shown in the sample screenshot below

<img width="999" alt="image" src="https://github.com/mongodb-partners/IoT_Greengrass_Realm_GenAI_framework/assets/101570105/da06f069-dbef-4a41-95d8-a52ea6b97ef9">



To view logs of running containers. replace the CONTAINER_ID of yours


```
docker logs -f <CONTAINER_ID>
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

On successful completion, the message should be generated as shown in the below screenshot

<img width="385" alt="image" src="https://github.com/mongodb-partners/IoT_Greengrass_Realm_GenAI_framework/assets/101570105/22516544-42c2-4098-9bb8-6cd0a7f62561">


Exit from the docker container

`exit`

Congratulations!! You have almost completed the edge setup. Move next to [Deploy MQTT Consumer to Edge Gateway](../../2-edge/cpp/consumer/README.md).

