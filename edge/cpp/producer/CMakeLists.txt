cmake_minimum_required(VERSION 3.15)

project(MyRealmCppProducer)

Include(FetchContent)

set(CMAKE_CXX_STANDARD 17)
find_package(PahoMqttCpp REQUIRED)
find_package(eclipse-paho-mqtt-c REQUIRED)
find_package(OpenSSL REQUIRED)


FetchContent_Declare(json URL https://github.com/nlohmann/json/releases/download/v3.11.2/json.tar.xz)
FetchContent_MakeAvailable(json)


add_executable(producer producer.cpp)

target_link_libraries(producer nlohmann_json::nlohmann_json)
target_link_libraries(producer PahoMqttCpp::paho-mqttpp3)
target_link_libraries(producer eclipse-paho-mqtt-c::paho-mqtt3as)
target_link_libraries(producer OpenSSL::SSL)