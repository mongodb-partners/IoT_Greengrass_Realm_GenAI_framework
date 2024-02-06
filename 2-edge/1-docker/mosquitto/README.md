# MQTT Service
---

## Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop/) 
* MacOS / Ubuntu

----

## Overview

This is the MQTT service that acts as a transport of messages between the producer and the consumer.

## Instructions

Move to `2-edge/1-docker/greengrass` directory

copy the credential.sample `cp greengrass-v2-credentials/credentials.sample  greengrass-v2-credentials/credentials `

Update the AWS credentials `aws_access_key_id and aws_secret_access_key` 

This will pull and start the MQTT service in the background

```
docker-compose up -d
```

Ensure the docker container is running 

```
docker ps -a
```

Ensure the AWS IoT GreenGrass device is created.

<img width="1488" alt="image" src="https://github.com/mongodb-partners/IoT_Greengrass_Realm_GenAI_framework/assets/101570105/5b93258e-6c93-4ff2-94ff-26c4858b00a5">
