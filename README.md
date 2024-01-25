# AWS IoT Greengrass | AWS Sagemaker | AWS Bedrock | MongoDB Realm | MongoDB Atlas  | MongoDB Atlas Vector Search

## High level Architecture

![architecture](./media/hla.png)

## Setup Instructions 

### 1. Atlas App Services
To begin with, lets setup the Atlas and App Services where the data will be stored in Atlas database, then the App Services should be linked with the Atlas, which will be used for syncing the data between the edge devices and the Atlas database.


[atlas](./atlas/) holds the configuration of the app service application that needs to be set up on Atlas for the mobile app.

[dump](./atlas/dump) holds the sample mongodb dump used in this demo.

#### Context on the collections used

    1. Job (Jobs created by Sagemaker based on sensor data)
    2. User (Application users for Web and Mobile)
    3. GGIotDeviceHealth (Greengrass Device telemetry data sent from the greengrass devices)
    4. Part (Different vehicle parts information)
    5. SensorData (Sensor data received from multiple vehicle sensors from the edge)
    6. Vehicle (Onboarded vehicles information )
    7. docs_mdb (For chat containing embeddings of vehicle information)



### 2. Edge

Once the Atlas Database and App Services are created, let's proceed to create the necessary edge containers. The edge container will receive data from the vehicle sensors (which is another mock producer container) and send the message to a topic via MQTT. This edge container will then receive and store the data in the Realm local database, utilizing the device sync service created in Step 1.

#### 2.1 Docker


Let's set up the Docker containers to create the Greengrass components such as things, thing types, and devices on AWS Greengrass.

Additionally, we'll run the producer Docker container to mock the vehicle sensor data, which will be consumed by the Greengrass edge container.

[docker](./docker/) holds the docker files needed to create and run the various containers needed for the edge. 


#### 2.2 Edge

Once the docker containers are started, we need to build and deploy the C++ Application that contains the Realm Device sync and MQTT Consumer. The building and deploying of this consumer application will happen via AWS components as the detailed steps will be given in the [README](./edge/cpp/consumer/README.md)

[edge](./edge/) holds the code for the consumer and producer.

Consumer is the component running on greengrass that interfaces with Realm to store sensor data.

Producer is are the vehicles sending sensor data. In our case, voltage and current readings.

Once the edge setup is done, we should be able to see the data in the Atlas collections. 

The data in the SensorData collection will be sent to AWS S3 as a json data using the Atlas triggers. (Triggers will be created as a part of Step 1)

### 3. AWS Ecosystem

#### 3.1 AWS Sagemaker

Next step would be deploying the sagemaker model endpoint and creating the lamba function which will invoke the sagemaker model.

After this step, we should be able to see the jobs data in the Job collection in the Atlas.

#### 3.2 Chat Assistant using AWS Bedrock, LangChain, Atlas Vector Search and AWS Lambda

Lets request the model access in the AWS Bedrock 

Next step would be to run the python script [generate_embeddings.py](./aws/bedrock/generate_embeddings.py) to generate embeddings.

Now, lets setup a lambda endpoint  for the chat assistant which will be consumed by the Mobile Application later in the steps.

[aws](./aws/) holds code and docs on setting up sagemaker and the lambda functions needed for predictive maintenance and the chat assistant.


### 4. Mobile

The jobs will be assigned to the users while creating the entries as a part of previous step.

[mobile](./mobile/) holds the mobile app code that shows maintenance jobs created for vehicles after analyzing their sensor data.

### 5. Web

Eventually, we should be able to see all Jobs, Vehicles, Parts and vehicle information in the fleet dashboard which is built using the realm device sync for web.

[web](./web/) holds the code for the web dashboard. This shows information about the fleet.

