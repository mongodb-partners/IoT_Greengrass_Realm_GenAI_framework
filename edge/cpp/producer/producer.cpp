#include <string>
#include <chrono>
#include <iostream>
#include "mqtt/async_client.h"

using namespace std;
using namespace std::chrono;

const std::string DFLT_ADDRESS { "host.docker.internal:1883" };

const string TOPIC { "topic" };
const int QOS = 1;

const auto PERIOD = seconds(5);
const int MAX_BUFFERED_MSGS = 120;


int main(int argc, char* argv[])
{
	string address = (argc > 1) ? string(argv[1]) : DFLT_ADDRESS;

	mqtt::async_client cli(address, "", MAX_BUFFERED_MSGS);

	mqtt::connect_options connOpts;
	connOpts.set_keep_alive_interval(MAX_BUFFERED_MSGS * PERIOD);
	connOpts.set_clean_session(true);
	connOpts.set_automatic_reconnect(true);
    
    double voltage = (20.0 - (-1.0)) * ( (double)rand() / (double)RAND_MAX ) + (-1.0);
    double current = (2.0 - (-2.0)) * ( (double)rand() / (double)RAND_MAX ) + (-2.0);
    
    std::cout << std::setprecision(15) << voltage << "\n" << current;

	mqtt::topic top(cli, TOPIC, QOS, true);
	try {
		// Connect to the MQTT broker
		cout << "Connecting to server '" << address << "'..." << flush;
		cli.connect(connOpts)->wait();
		cout << "OK\n" << endl;
		top.publish("{\"vehicleId\":\"652ed1957fb496144946ae76\", \"voltage\": 13.012039102, , \"current\": -0.182371182}");
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