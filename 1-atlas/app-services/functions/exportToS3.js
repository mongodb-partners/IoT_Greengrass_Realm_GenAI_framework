import AWS from 'aws-sdk'

exports = async function () {
    const s3 = new AWS.S3({
        accessKeyId: context.values.get("AWSAccessKeyIdRef"),
        secretAccessKey: context.values.get("AWSSecretAccessKeyRef")
    })
    
    const collection = context.services.get('mongodb-atlas').db("GreengrassIot").collection("SensorData");
    
    const doc = await collection.aggregate([
      {
        $sort:{vehicleId: -1, timestamp:-1}
      },
      {
        $group:{_id:"$vehicleId",items:{$push:{voltage:"$voltage", current: "$current"}}}
      },
      {
        $project:{items:{$slice:["$items", 20]}}
      }
    ]).toArray();
    
    doc.forEach((value, index, array) => {
      const body = value.items.map(function (obj) {
        return [obj.voltage, obj.current];
      });
      
      const params = {
        Bucket: 'aws-iot-vehicle-telemetry',
        Key: `IIoT/${String(value._id)}.txt`,
        Body: `[${JSON.stringify(body)}]`
      }
      
      s3.upload(params, (err, data) => {
        if (err) {
            throw Error(err)
        }
      })
    })
    
    return true;
};
