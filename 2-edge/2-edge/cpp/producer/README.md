# C++ | MQTT | Producer

## Prerequisites

* [CMake](https://cmake.org/download/)
* MacOS / Ubuntu

To proceed running inside the docker container, follow steps in README.md at `docker/vehicle1/README.md`

## Optional

Steps below are given to run locally instead of running inside a docker container. 

## Overview

Here we are building the C++ application with MQTT produce a message to a topic via MQTT

### Instructions

```
cd cpp/producer

mkdir build

cmake -B build -S . -DCMAKE_BUILD_TYPE="Debug" .

cmake --build build --config Debug
```

To run the producer

```
build/producer
```
