# Realm Device Sync | Greengrass | MQTT
---

## Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop/) 
* MacOS / Ubuntu

----

## Overview

Here we are building four docker containers

* `MQTT CONTAINER` (mosquitto) [Optional, if system already has MQTT installed]
* `CONSUMER CONTAINER` (greengrass)
* `VEHICLE CONTAINER 1` (vehicle1)
* `VEHICLE CONTAINER 2` (vehicle2) [Optional]

1.  `MQTT CONTAINER` acts as a transport to produce and consumer messages between different containers.
2.  `CONSUMER CONTAINER` acts as a MQTT message consumer and once it receives the messages it parses and stores the message in the realm local database which then will be synced back to Atlas via device sync in real-time. This application is built using C++ with Realm dependency, JSON lib dependency, and MQTT dependency.
3.  `VEHICLE CONSUMER 1` acts as a MQTT message producer which send a message to a topic. This application is also built with C++.
4.  `VEHICLE CONSUMER 2` same as `VEHICLE CONSUMER 1`.


![Architecture](https://bitbucket.org/We-Kan-Code/aws-iot-pov/raw/df8e0470a6f75874a4ce74f70b42994be1eff8e7/architecture/infra2.png)
