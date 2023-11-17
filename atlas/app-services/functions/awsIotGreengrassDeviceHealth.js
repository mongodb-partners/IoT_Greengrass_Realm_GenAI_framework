exports = function ({ headers, body }, response) {
    const contentTypes = headers["Content-Type"];
    const reqBody = body;
    console.log("Content-Type:", JSON.stringify(contentTypes));
    const serialized = reqBody.text();
    // Parse the string into a usable object
    const jsonBody = JSON.parse(serialized);
    console.log(jsonBody);
    const GGIotDeviceHealthCollection = context.services.get("mongodb-atlas").db("GreengrassIot").collection("GGIotDeviceHealth");
    GGIotDeviceHealthCollection.insertOne(jsonBody)
        .then(result => console.log(`Successfully inserted item with _id: ${result.insertedId}`))
        .catch(err => console.error(`Failed to insert item: ${err}`))
    response.setStatusCode(200)
    const s = JSON.stringify({
        requestId: headers['X-Amz-Firehose-Request-Id']?.[0],
        timestamp: (new Date()).getTime()
    })
    response.addHeader(
        "Content-Type",
        "application/json"
    );
    response.setBody(s)
    console.log("response JSON:" + s)
    return
};
