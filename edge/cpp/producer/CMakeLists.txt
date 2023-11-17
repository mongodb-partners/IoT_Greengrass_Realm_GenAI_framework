cmake_minimum_required(VERSION 3.15)

project(MyRealmCppProducer)

set(CMAKE_CXX_STANDARD 17)
find_package(PahoMqttCpp REQUIRED)

add_executable(producer producer.cpp)

target_link_libraries(producer PahoMqttCpp::paho-mqttpp3)