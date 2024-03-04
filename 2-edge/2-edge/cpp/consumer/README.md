# C++ | MQTT | Consumer

## Prerequisites

* [CMake](https://cmake.org/download/) 
* MacOS / Ubuntu

## Overview

Here we are building the C++ application with MQTT consumer and Realm Device sync to consume the message from the MQTT transport and store it in the Realm database which will be synced to MongoDB in real-time via Device Sync


Change the Realm App ID in `2-edge\2-edge\cpp\consumer\consumer.cpp` file.  **realm::App("APP_ID");**


<img width="707" alt="image" src="https://github.com/mongodb-partners/IoT_Greengrass_Realm_GenAI_framework/assets/101570105/d710554c-8e0d-4e68-87dd-4ed295058714">



Enable API-key authentication and create an API-key in [Mongo App Services](https://www.mongodb.com/docs/atlas/app-services/authentication/api-key/#create-a-server-api-key)
Use this key inside the C++ code in **consumer.cpp** file in **realm::App::credentials::api_key("API_KEY")**


<img width="1392" alt="image" src="https://github.com/mongodb-partners/IoT_Greengrass_Realm_GenAI_framework/assets/101570105/7e4f8e71-12a2-49eb-847d-e403dbde06cb">



Ensure the API authentication is activated.

![ApiKey](../../../../media/app-services-apikey-create.png)



### Instructions

```
docker ps -a

docker cp ../../2-edge/cpp/consumer <realmgreengrass containerid>:/

docker exec -it <realmgreengrass containerid> /bin/bash

cd /consumer

mkdir build

cmake -B build -S . -DCMAKE_BUILD_TYPE="Debug" .

```


Sample output on successful completion


    ...........
    Dependencies: PACKAGE_NAME=realm-core;VERSION=13.15.1;OPENSSL_VERSION=3.0.8;ZLIB_VERSION=1.2.13;MDBREALM_TEST_SERVER_TAG=2023-06-13
    -- Performing Test HAVE_-Wno-psabi
    -- Performing Test HAVE_-Wno-psabi - Success
    -- Performing Test HAVE_-Wpartial-availability
    -- Performing Test HAVE_-Wpartial-availability - Success
    -- Performing Test HAVE_-Wno-redundant-move
    -- Performing Test HAVE_-Wno-redundant-move - Success
    -- Performing Test HAVE_LINKER_lld
    -- Performing Test HAVE_LINKER_lld - Failed
    -- Performing Test HAVE_LINKER_gold
    -- Performing Test HAVE_LINKER_gold - Failed
    -- Looking for readdir64
    -- Looking for readdir64 - not found
    -- Performing Test HAVE-Wno-unused-but-set-variable
    -- Performing Test HAVE-Wno-unused-but-set-variable - Success
    -- Performing Test HAVE-Wno-unreachable-code
    -- Performing Test HAVE-Wno-unreachable-code - Success
    -- Performing Test HAVE-Wno-sign-compare
    -- Performing Test HAVE-Wno-sign-compare - Success
    -- Looking for epoll_create
    -- Looking for epoll_create - not found
    -- Performing Test HAVE-Wunused-but-set-variable
    -- Performing Test HAVE-Wunused-but-set-variable - Success
    -- Configuring done (60.7s)
    -- Generating done (0.1s)
    -- Build files have been written to: /consumer/build



```
cmake --build build --config Debug

```

Sample screenshot of the successful completion of the build

<img width="998" alt="image" src="https://github.com/mongodb-partners/IoT_Greengrass_Realm_GenAI_framework/assets/101570105/59a93793-d16d-4ff1-8aac-595378002326">


(Optional) To run the consumer in the local. Ensure you are in the consumer folder copied from the container.

```
build/consumer
```

on a successful run, it will consume the data . Below is a sample output.

```

Connecting to the MQTT server...OK
Waiting for messages on topic: 'topic'
Starting
{"current":0.680375434309419,"timestamp":1709556676763,"vehicleId":"65e09427028c72731d009fae","voltage":6.521360975467302}
collection changed 4 objects in collection
Done writing to Realm
topic: {"current":0.680375434309419,"timestamp":1709556676763,"vehicleId":"65e09427028c72731d009fae","voltage":6.521360975467302}

```


exit from the container

```
exit
```

copy the consumer repo from the container to the base directory

```
docker cp <realmgreengrass container>:/consumer ../../../
```





Steps to deploy the C++ Application to the Greengrass device container via [AWS Components](https://docs.aws.amazon.com/greengrass/v2/developerguide/create-components.html)

1. Ensure you are in the consumer folder copied from the container and Zip the build folder as consumer.zip
   ```
   cd ../../../consumer/
   zip -r consumer.zip ./
   ```
   
3. Create a S3 folder structure `s3://aws-iot-vehicle-telemetry/cpp.consumer.realm/1.0.0/` and Upload to AWS S3 Bucket using the console or [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) using

   
   `aws s3 cp consumer.zip s3://aws-iot-vehicle-telemetry/cpp.consumer.realm/1.0.0/`
   
   
5. Ensure the role "GreengrassV2TokenExchangeRole" has appropriate permissions to read the files from the S3 bucket. 


In-line policy: GreengrassV2TokenExchangeRoleAccess

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams",
                "s3:GetBucketLocation"
            ],
            "Resource": "*"
        }
    ]
}

```

Trust Relationship:
```
{
"Version": "2012-10-17",
"Statement": [
    {
        "Effect": "Allow",
        "Principal": {
            "Service": "credentials.iot.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
    }
        ]
}
```

<img width="689" alt="image" src="https://github.com/mongodb-partners/IoT_Greengrass_Realm_GenAI_framework/assets/101570105/c355f68c-2f26-4a8a-a6f3-0c5c2a9e17c9">


7. Create an AWS Greengrass Component using the console or aws-cli https://docs.aws.amazon.com/greengrass/v2/developerguide/create-components.html

![Create Component](../../../../media/create-comp.png)
4. Recipe example. Update the S3 bucket path.
```sh
RecipeFormatVersion: "2020-01-25"
ComponentName: "cpp.consumer.realm"
ComponentVersion: "1.0.0"
ComponentType: "aws.greengrass.generic"
ComponentDescription: "Realm C++ Consumer"
Manifests:
- Platform:
    os: "linux"
  Lifecycle:
    install:
      Script: "chmod +x {artifacts:decompressedPath}/consumer/build/consumer"
      RequiresPrivilege: "true"
    Run: "{artifacts:decompressedPath}/consumer/build/consumer"
  Artifacts:
  - Uri: "s3://aws-iot-vehicle-telemetry/cpp.consumer.realm/1.0.0/consumer.zip"
    Unarchive: "ZIP"
Lifecycle: {}
```





5. Once the component is created, open the component and deploy it to a Greengrass device using the Deploy option and create a new deployment by entering the Greengrass core device. select the target type as core device and copy the core device name. Select ```cpp.consumer.realm``` in the My Components list. Select ```cpp.consumer.realm``` in the Selected components. Keep all other options as default.
 
![Component Deployment](../../../../media/comp-deployment.png)
6. Wait for a few minutes for the deployment to be completed. Now the producer can produce a message to the topic which will be consumed by this application deployed using the components. 

<img width="1686" alt="image" src="https://github.com/mongodb-partners/IoT_Greengrass_Realm_GenAI_framework/assets/101570105/c03ea136-816c-4d85-ad7c-7ebcd4632cae">


6. **Congratulations!!**, You have now completed the setup of producer and consumer. To validate the setup, you can now try one message through the producer in the vehicle container and check in the Atlas database for syncing.

7. (optional) You can move in the vehicle1 container and try to produce (ie build\producer) and check the Atlas database collection - vehicle sensor for data sync.

8. Lets move to the next step [3-aws-greensgrass-telemetry](../../../../3-aws-greengrass-telemetry) to generate the telemetry data.

## Troubleshooting

**Dataflow :** Producer --> MQTT --> Consumer --> Realm --> MongoDB Atlas

**Producer:**

```
docker exec -it <vehicle1> /bin/bash

cd /producer

build/producer

```

**MQTT**

```
docker exec -it <mosquitto container id> /bin/bash

cat /mqtt/log/mosquitto.log

```


**Consumer / Realm:**

```
docker exec -it <realmgreengrass container id> /bin/bash

cat /greengrass/v2/logs/greengrass.log

cat /greengrass/v2/logs/cpp.consumer.realm.log

cd /greengrass/v2/packages/artifacts-unarchived/cpp.consumer.realm/1.0.0

```


**Application Services Logs(Sync):**

<img width="1583" alt="image" src="https://github.com/mongodb-partners/IoT_Greengrass_Realm_GenAI_framework/assets/101570105/61260542-d6a1-4f02-bf1a-40d4e5ae1fe4">



**MongoDB Atlas**

<img width="882" alt="image" src="https://github.com/mongodb-partners/IoT_Greengrass_Realm_GenAI_framework/assets/101570105/79ff4fdf-71dd-4a30-9cc9-1d4c2be6ac00">




