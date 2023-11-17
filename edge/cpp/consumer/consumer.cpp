#include <stdio.h>
#include <cpprealm/sdk.hpp>
#include <ostream>
#include <mqtt/client.h>

// JSON parser
#include <nlohmann/json.hpp>


#if REALM_HAVE_UV
#include <uv.h>
#elif REALM_PLATFORM_APPLE
#include <realm/util/cf_ptr.hpp>
#include <CoreFoundation/CoreFoundation.h>
#else
#error "No EventLoop implementation selected"
#endif

using json = nlohmann::json;


struct SensorData: realm::object<SensorData> {
    realm::persisted<realm::object_id> _id;
    realm::persisted<realm::object_id> vehicleId;
    realm::persisted<double> voltage;
    realm::persisted<double> current;

    static constexpr auto schema = realm::schema("SensorData",
                                                 realm::property<&SensorData::_id, true>("_id"),
                                                 realm::property<&SensorData::vehicleId>("vehicleId"),
                                                 realm::property<&SensorData::voltage>("voltage"),
                                                 realm::property<&SensorData::current>("current")
    );
};



int main() {
    auto app = realm::App("greengrasstest-jnsko");
    auto user = app.login(realm::App::credentials::anonymous()).get();
    auto config = user.flexible_sync_configuration();

    auto realm = realm::open<SensorData>(std::move(config));
    realm.subscriptions().update([](realm::mutable_sync_subscription_set& subs) {
        // subscriptions isn't needed
        if (!subs.find("all_sensor_data")) {
            subs.add<SensorData>("all_sensor_data");
        }
    }).get();

    auto results = realm.objects<SensorData>();
    auto token = results.observe([](realm::results_change<SensorData> change) {
        std::cout << "collection changed " << change.collection->size() << " objects in collection" << "\n";
    });


    std::string ip = "host.docker.internal:1883";
    // Then, define an ID to be used by the client when communicating with the broker.
    std::string id = "consumer";
 
    // Construct a client using the Ip and Id, specifying usage of MQTT V5.
    mqtt::client client(ip, id, mqtt::create_options(MQTTVERSION_5));
    // Use the connect method of the client to establish a connection to the broker.
    client.connect();
    // In order to receive messages from the broker, specify a topic to subscribe to.
    client.subscribe("topic");
    // Begin the client's message processing loop, filling a queue with messages.
    client.start_consuming();
 
    bool running = true;
    while (running)
    {
        // Construct a message pointer to hold an incoming message.
        mqtt::const_message_ptr messagePointer;
 
        // Try to consume a message, passing messagePointer by reference.
        // If a message is consumed, the function will return `true`, 
        // allowing control to enter the if-statement body.
        if (client.try_consume_message(&messagePointer))
        {
            // Construct a string from the message payload.
            std::string messageString = messagePointer -> get_payload_str();
            
            json jsonMessage = json::parse(messageString);

            std::cout << messageString << std::endl;
            realm.write([&]() {
                SensorData rec;
                rec._id = realm::object_id::generate();
                rec.vehicleId = realm::object_id(jsonMessage["vehicleId"]);
		        rec.voltage = (int) jsonMessage["voltage"];
                rec.current = (int) jsonMessage["current"];
                realm.add(rec);
            });
            std::cout << "Done writing to Realm" << std::endl;
            if (messageString == "quit")
            {
                running = false;
            } 
        }
    }
    return 0;

#if REALM_HAVE_UV
    uv_run(uv_default_loop(), UV_RUN_DEFAULT);
#elif REALM_PLATFORM_APPLE
    CFRunLoopRun();
#else
#error "No EventLoop implementation selected"
#endif
    return 0;
}