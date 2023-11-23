# Setting up Lambda function for Predictive Maintenance

## Prerequisites

* S3 bucket to deploy code to Lambda
* S3 bucket to which sensor data is exported (Check [App Services](../../../atlas/))
* Sagemaker endpoint for Predictive Maintenance
* Cluster on Atlas

## Creating the Lambda function

Log in to AWS Console, got to Lambda functions and click on create function.

![Lambda creation](../../../media/lambda-function-creation.png)

Provide a name for your function, be sure to choose Python 3.11 as the Runtime and click on create function.

## Deploying to Lambda

Now that our chat Lambda function is created, we'll deploy our code to it.

The chat function needs additional packages, namely **boto3** and **pymongo (v4.6.0)** to interface with the Sagemaker endpoint and Atlas cluster.

On your local machine, install the packges in the same folder you place lambda_function.py in. You can install packages to a specific folder using the below command

```bash
pip install --target ./ package_name
```

Zip up the contents of the entire folder (lambda_function.py and the other package folders). **Make sure the packages and the lambda function code are at the top level as shown below**

![Lambda deployment](../../../media/lambda-deploy-2.png)

Now upload your zip file to an S3 bucket as it'll be too large to directly upload to your Lambda function.

Open up the Lambda function we created earlier, go to code, click on upload from and choose Amazon S3 location as shown below.

![Lambda upload](../../../media/lambda-upload-s3.png)

Now enter the path to the zip file in your s3 bucket and click on Save.

## Setting up environment variables

Open up the Lambda function, go to configuration and configure the below environment variables

![Lambda env vars](../../../media/predict-env-vars.png)

Fill in the values with your cluster's connection string and your sagemaker endpoint and save.

## Setting up S3 trigger

The final step is to run this function, to do that we'll set up a trigger that runs it when new sensor data is uploaded to a source S3 bucket.

As shown below, the export trigger in App Services uploads data as simple text files into your configured S3 bucket at the configured interval.

![S3 sensor data](../../../media/predict-sensor-data.png)

Here the file names are the vehicle ids (MongoDB Object IDs) and the files themselves contain the last 20 voltage and current sensor readings in the format expected by the sagemaker endpoint.

To set up the trigger, open your Lambda function and click on Add trigger.

![Lambda trigger](../../../media/lambda-s3-trigger.png)

In the Select a source dropdown, choose S3, fill in the prefix (the one used in the export function in app services), check Acknowledge and click on Add.
