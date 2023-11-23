import os.path
import json
import urllib.parse
import boto3
import botocore
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

s3 = boto3.client('s3')
client = MongoClient(host=os.environ.get("ATLAS_URI"))

def lambda_handler(event, context):
    # Get the object from the event and show its content type
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        print("CONTENT TYPE: " + response['ContentType'])
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        raise e
        
    config = botocore.config.Config(read_timeout=200)
    runtime = boto3.client('runtime.sagemaker', config=config)
    
    payload = response['Body'].read().decode('utf-8')
    
    response = runtime.invoke_endpoint(EndpointName=os.environ.get("SAGEMAKER_ENDPOINT"),
                                       ContentType='application/json',
                                       Body=payload)
    out = json.loads(response['Body'].read().decode())[0]
    
    prob_failure = (100*(1.0-out[0]))

    message = "Vehicle in good health. No maintenance required."

    if prob_failure > float(os.environ.get("FAILURE_THRESHOLD")):
        db = client[os.environ.get("DB_NAME")] 
        collection = db.Job

        vehicle_id = ObjectId(key[5:29])
        job = {
            "assignedTo": ObjectId('6537c7b54a4588f9fd2ff8aa'),
            "createdAt": datetime.now(),
            "notes": "",
            "status":"TODO",
            "type":"MAINTENANCE",
            "vehicleId": vehicle_id
        }
    
        result = collection.update_one({"vehicleId": vehicle_id, "status": str("TODO")}, {"$set": job}, upsert=True)
    
        message = "Failed to create maintenance job"
    
        if result.upserted_id:
            message = "Maintenance job created successfully"

        if result.modified_count:
            message = "Maintenance job updated successfully"
    
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "message ": message
        })
    }
    