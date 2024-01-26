#include <string>
#include <chrono>
#include <iostream>
#include <ctime>   
#include "mqtt/async_client.h"
#include <nlohmann/json.hpp>

using namespace std;
using namespace std::chrono;
using json = nlohmann::json;

const std::string DFLT_ADDRESS { "host.docker.internal:1883" };

const string TOPIC { "topic" };
const int QOS = 1;

const auto PERIOD = seconds(5);
const int MAX_BUFFERED_MSGS = 120;


double GenerateRandom(double min, double max)
{
    if (min > max)
    {
        std::swap(min, max);
    }
    return min + (double)rand() * (max - min) / (double)RAND_MAX;
}

int main(int argc, char* argv[])
{
 	using namespace std::chrono;

	string address = (argc > 1) ? string(argv[1]) : DFLT_ADDRESS;

	mqtt::async_client cli(address, "", MAX_BUFFERED_MSGS);

	mqtt::connect_options connOpts;
	connOpts.set_keep_alive_interval(MAX_BUFFERED_MSGS * PERIOD);
	connOpts.set_clean_session(true);
	connOpts.set_automatic_reconnect(true);

	mqtt::topic top(cli, TOPIC, QOS, true);
	try {
		// Connect to the MQTT broker
		cout << "Connecting to server '" << address << "'..." << flush;
		cli.connect(connOpts)->wait();
		cout << "OK\n" << endl;

		auto now = system_clock::now();
		auto msec = duration_cast<milliseconds>(now.time_since_epoch()).count();

		json payload;
		payload["vehicleId"] = std::getenv("VEHICLE_ID");
		payload["current"] = GenerateRandom(-1.0, 1);
		payload["voltage"] = GenerateRandom(1.0, 15);
		payload["timestamp"] = msec;
		top.publish(payload.dump());
		cout << "\nDisconnecting..." << flush;
		cli.disconnect()->wait();
		cout << "OK" << endl;
	}
	catch (const mqtt::exception& exc) {
		cerr << exc.what() << endl;
		return 1;
	}

 	return 0;
}