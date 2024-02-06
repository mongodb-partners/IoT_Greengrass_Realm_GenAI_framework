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
