# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

FROM ubuntu:20.04

# Author
LABEL maintainer="AWS IoT Greengrass"

# Replace the args to lock to a specific version
ARG GREENGRASS_RELEASE_VERSION=2.5.3
ARG GREENGRASS_ZIP_FILE=greengrass-${GREENGRASS_RELEASE_VERSION}.zip
ARG GREENGRASS_RELEASE_URI=https://d2s8p88vqu9w66.cloudfront.net/releases/${GREENGRASS_ZIP_FILE}
ARG GREENGRASS_ZIP_SHA256=greengrass.zip.sha256
# Set up Greengrass v2 execution parameters
# TINI_KILL_PROCESS_GROUP allows forwarding SIGTERM to all PIDs in the PID group so Greengrass can exit gracefully
ENV TINI_KILL_PROCESS_GROUP=1 \ 
    GGC_ROOT_PATH=/greengrass/v2 \
    PROVISION=false \
    AWS_REGION=us-east-1 \
    THING_GROUP_NAME=default_thing_group_name \
    TES_ROLE_NAME=default_tes_role_name \
    TES_ROLE_ALIAS_NAME=default_tes_role_alias_name \
    COMPONENT_DEFAULT_USER=default_component_user \
    DEPLOY_DEV_TOOLS=false \
    INIT_CONFIG=default_init_config
RUN env


# Python package management and basic dependencies
RUN apt update && apt install software-properties-common -y
RUN add-apt-repository ppa:deadsnakes/ppa && apt install python3.8 -y
RUN ln -s /usr/bin/pip3 /usr/bin/pip && \
    ln -s /usr/bin/python3.8 /usr/bin/python

RUN apt-get -y install sudo ca-certificates curl gnupg nano
RUN mkdir -p /etc/apt/keyrings && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_16.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get install nodejs -y
# Entrypoint script to install and run Greengrass
COPY "greengrass-entrypoint.sh" /
COPY "${GREENGRASS_ZIP_SHA256}" /


RUN apt-get update && \
    apt-get install -y openjdk-11-jre-headless && \
    apt-get clean;
RUN apt install wget unzip -y
# As required by Realm install below libraries
RUN apt-get install -y build-essential libcurl4-openssl-dev libuv1-dev libprocps-dev libssl-dev zlib1g-dev cmake doxygen git
RUN wget $GREENGRASS_RELEASE_URI && sha256sum -c ${GREENGRASS_ZIP_SHA256}
RUN chmod +x /greengrass-entrypoint.sh
RUN mkdir -p /opt/greengrassv2 $GGC_ROOT_PATH && unzip $GREENGRASS_ZIP_FILE -d /opt/greengrassv2 && rm $GREENGRASS_ZIP_FILE && rm $GREENGRASS_ZIP_SHA256

# modify /etc/sudoers
COPY "modify-sudoers.sh" /
RUN chmod +x /modify-sudoers.sh
RUN ./modify-sudoers.sh



WORKDIR /pahocpp
RUN git clone https://github.com/eclipse/paho.mqtt.cpp
WORKDIR /pahocpp/paho.mqtt.cpp
RUN git clone https://github.com/eclipse/paho.mqtt.c.git
WORKDIR /pahocpp/paho.mqtt.cpp/paho.mqtt.c
RUN git checkout v1.3.8
RUN cmake -Bbuild -H. -DPAHO_ENABLE_TESTING=OFF -DPAHO_BUILD_STATIC=ON -DPAHO_WITH_SSL=ON -DPAHO_HIGH_PERFORMANCE=ON
RUN cmake --build build/ --target install
RUN ldconfig
WORKDIR /pahocpp/paho.mqtt.cpp
RUN cmake -Bbuild -H. -DPAHO_BUILD_STATIC=ON
RUN cmake --build build/ --target install
RUN ldconfig


ENTRYPOINT ["/greengrass-entrypoint.sh"]