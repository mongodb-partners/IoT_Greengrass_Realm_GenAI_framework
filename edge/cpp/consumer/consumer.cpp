#include <iostream>
#include <stdio.h>
#include <cstdlib>
#include <string>
#include <cstring>
#include <cctype>
#include <thread>
#include <chrono>
#include "mqtt/async_client.h"
#include <cpprealm/sdk.hpp>
#include <ostream>
#include <ctime>

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

using namespace std::chrono;
using json = nlohmann::json;

struct SensorDatum: realm::object<SensorDatum> {
    realm::persisted<realm::object_id> _id;
    realm::persisted<realm::object_id> vehicleId;
	realm::persisted<std::chrono::time_point<std::chrono::system_clock>> timestamp;
    realm::persisted<double> voltage;
    realm::persisted<double> current;

    static constexpr auto schema = realm::schema("SensorDatum",
                                                 realm::property<&SensorDatum::_id, true>("_id"),
                                                 realm::property<&SensorDatum::vehicleId>("vehicleId"),
                                                 realm::property<&SensorDatum::timestamp>("timestamp"),
                                                 realm::property<&SensorDatum::voltage>("voltage"),
                                                 realm::property<&SensorDatum::current>("current")
    );
};

using namespace std;

const std::string DFLT_ADDRESS { "host.docker.internal:1883" };
const string CLIENT_ID		{ "" };

const string TOPIC 			{ "topic" };
const auto PERIOD = seconds(5);
const int MAX_BUFFERED_MSGS = 120;

const int  QOS = 1;

int main(int argc, char* argv[])
{
	mqtt::async_client cli(DFLT_ADDRESS, CLIENT_ID);

	mqtt::connect_options connOpts;
	connOpts.set_keep_alive_interval(MAX_BUFFERED_MSGS * PERIOD);
	connOpts.set_clean_session(true);
	connOpts.set_automatic_reconnect(true);

	try {

        auto app = realm::App("REALM_APP_ID");
        auto user = app.login(realm::App::credentials::api_key("API_KEY")).get();
        auto config = user.flexible_sync_configuration();

        auto realm = realm::open<SensorDatum>(std::move(config));
        realm.subscriptions().update([](realm::mutable_sync_subscription_set& subs) {
            // subscriptions isn't needed
            if (!subs.find("all_sensordata")) {
                subs.add<SensorDatum>("all_sensordata");
            }
        }).get();

        auto results = realm.objects<SensorDatum>();
        auto token = results.observe([](realm::results_change<SensorDatum> change) {
            std::cout << "collection changed " << change.collection->size() << " objects in collection" << "\n";
        });
		// Start consumer before connecting to make sure to not miss messages
		cli.start_consuming();

		// Connect to the server
		cout << "Connecting to the MQTT server..." << flush;
		auto tok = cli.connect(connOpts);

		// Getting the connect response will block waiting for the
		// connection to complete.
		auto rsp = tok->get_connect_response();

		// If there is no session present, then we need to subscribe, but if
		// there is a session, then the server remembers us and our
		// subscriptions.
		if (!rsp.is_session_present())
			cli.subscribe(TOPIC, QOS)->wait();

		cout << "OK" << endl;

		// Consume messages
		// This just exits if the client is disconnected.
		// (See some other examples for auto or manual reconnect)
		cout << "Waiting for messages on topic: '" << TOPIC << "'" << endl;

		while (true) {
			auto msg = cli.consume_message();
			if (!msg) break;

            std::string messageString = msg->to_string();
            std::cout << "Starting" << std::endl;

            json jsonMessage = json::parse(messageString);
            std::cout << messageString << std::endl;
            realm.write([&]() {
                SensorDatum s;
                s._id = realm::object_id::generate();
                s.vehicleId = (realm::object_id) jsonMessage["vehicleId"];
		        s.voltage = (double) jsonMessage["voltage"];
		        s.current = (double) jsonMessage["current"];
		        s.timestamp = std::chrono::system_clock::from_time_t(time_t{0})+std::chrono::milliseconds(jsonMessage["timestamp"]);
                realm.add(s);
            });
            std::cout << "Done writing to Realm" << std::endl;

			cout << msg->get_topic() << ": " << msg->to_string() << endl;
		}

		// If we're here, the client was almost certainly disconnected.
		// But we check, just to make sure.
		if (cli.is_connected()) {
			cout << "\nShutting down and disconnecting from the MQTT server..." << flush;
			cli.unsubscribe(TOPIC)->wait();
			cli.stop_consuming();
			cli.disconnect()->wait();
			cout << "OK" << endl;
		}
		else {
			cout << "\nClient was disconnected" << endl;
		}
	}
	catch (const mqtt::exception& exc) {
		cerr << "\n  " << exc << endl;
		return 1;
	}

 	return 0;
}

