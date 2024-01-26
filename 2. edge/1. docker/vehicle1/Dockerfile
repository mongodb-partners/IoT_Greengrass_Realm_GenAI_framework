FROM ubuntu:20.04

WORKDIR /


RUN apt update 
ENV DEBIAN_FRONTEND=noninteractive 

RUN apt install git build-essential libssl-dev doxygen graphviz cmake -y

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

ENTRYPOINT ["tail", "-f", "/dev/null"]
