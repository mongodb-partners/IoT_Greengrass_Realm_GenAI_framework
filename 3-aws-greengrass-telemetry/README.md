# Device health telemetry

IoT Device health telemetry data helps you monitor the performance of critical operations on your Greengrass core devices. You can use these applications to gain insights into fleet health.

To set it up,

1. Create on-demand [AWS Kinesis Data Stream ](https://us-east-1.console.aws.amazon.com/kinesis/home?region=us-east-1#/streams/create) and name the stream as ```RealmGreengrass```

   ![DS](../media/stream.png)

3. Open the Amazon EventBridge console, and choose Create rule.
4. Under Name and Description, enter a name as ```RealmGreengrassHealthCheck``` and a description for the rule.
5. Under Select Event bus, keep the default option.
6. Under the Creation method, Select `Use Pattern Form`. <br><br>![Pattern](../media/eb-pattern.png)
7. For Event Source, choose AWS Services, For AWS Service, choose Greengrass, For Event type, select Greengrass Telemetry Data.
8. Under Select targets, configure your target. The following example uses an Amazon Kinesis. <br><br>![Target](../media/eb-target.png)

9. Go to Mongo Cloud, inside App Services, create an HTTP Endpoint with POST method, return type as JSON, and create a function to associate the HTTP endpoint with it and use the following sample code to create the telemetry health records in the MongoDB Collection

    ```javascript
    exports = function ({ headers, body }, response) {
        const contentTypes = headers["Content-Type"];
        const reqBody = body;
        const serialized = reqBody.text();
        const jsonBody = JSON.parse(serialized);
        console.log(jsonBody);
        const GGIotDeviceHealthCollection = context.services.get("mongodb-atlas").db("VehicleMaintenance").collection("DeviceHealth");
        GGIotDeviceHealthCollection.insertOne(jsonBody)
            .then(result => console.log(`Successfully inserted item with _id: ${result.insertedId}`))
            .catch(err => console.error(`Failed to insert item: ${err}`))
        response.setStatusCode(200)
        const res = JSON.stringify({
            requestId: headers['X-Amz-Firehose-Request-Id']?.[0],
            timestamp: (new Date()).getTime()
        })
        response.addHeader(
            "Content-Type",
            "application/json"
        );
        response.setBody(res)
        return
    };
    ```
    ![Http](../media/http-endpoint.png)

10. Create an [API Key in App services](https://www.mongodb.com/docs/atlas/app-services/authentication/api-key/) to use in AWS Firehose for granting access to AWS to trigger the HTTP Endpoint. ![ApiKey](../media/app-services-apikey-create.png)<br><br>

11. Create [AWS Kinesis Data Firehose](https://us-east-1.console.aws.amazon.com/firehose/home?region=us-east-1#/create). Select source as Kinesis data stream and target as MongoDB Cloud, In Destination settings, Paste the HTTP URL in the Firehose console under MongoDB Realm webhook URL. Then use the API Key created in MongoDB Console, and paste it into API Key in the Firehose console. No data transformation is needed for this example. Select "Not enabled" in Content encoding. ![Firehose](../media/firehose.png)<br><br>

12. Configure Backup settings to send failed data to S3 buckets. Select the S3 bucket name in the dropdown to send failed events, and provide a prefix if needed. Then create the delivery stream.

13. Hurray!! completed halfway through!! Now let's switch to [Sagemaker](../4-aws-sagemaker/predictive-maintenance/README.md) setup.
