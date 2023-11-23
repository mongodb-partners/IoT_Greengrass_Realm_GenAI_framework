# Realm Device Sync | Greengrass | MQTT
--- 

## Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop/) 
* MacOS / Ubuntu

----

## Overview

Here we are building the docker image and running the container which will have pre-installed dependency libraries for Realm and Greengrass.

The following container will have a C++ application deployed via AWS Component that listens for the messages from a topic name `topic` and will parse and save the message received in it to Realm local database, which then sync to Atlas via Device sync in real-time.


Refer this container as `CONSUMER CONTAINER` throughout the setup.

### Instructions

After building this image, it will consist of pre-installed libraries for realm and greengrass dependencies.

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