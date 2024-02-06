# MQTT Service
---

## Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop/) 
* MacOS / Ubuntu

----

## Overview

This is the MQTT service that acts as a transport of messages between the producer and the consumer.

## Instructions

Move to `2-edge/1-docker/mosquitto` directory

This will pull and start the MQTT service in the background

```
docker-compose up -d
```

Ensure the docker container is running 

```
docker ps -a
```

On successful completion move the setting up to the next container [./greengrass](../greengrass/) 
