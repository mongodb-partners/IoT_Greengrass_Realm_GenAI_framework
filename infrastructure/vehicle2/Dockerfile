FROM ubuntu:20.04

WORKDIR /

RUN apt-get update && apt-get install git build-essential libssl-dev doxygen graphviz cmake -y

ENTRYPOINT ["tail", "-f", "/dev/null"]
