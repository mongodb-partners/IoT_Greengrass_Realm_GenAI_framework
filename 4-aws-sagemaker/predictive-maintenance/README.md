# Set up AWS backend for Predictive Maintenance

We will be using an Amazon Sagemaker jumpstart solution to quickly deploy a model, train it, and create an endpoint.

## 1. Sagemaker

This solution uses the ML model provided by the SageMaker jumpstart <https://github.com/awslabs/aws-fleet-predictive-maintenance/> to do predictive maintenance for the vehicles.

You'll need to access Sagemaker Studio to quickly set up the jumpstart solution. To do that, open up your AWS Console, go to Sagemaker, and click on Create Domain.

![Sagemaker domain](../../media/sagemaker-domain.png)

Choose Quick Setup and click on Set Up.

This will take some time.

Once the domain is ready. Click on the dropdown and choose Studio as shown below

![Sagemaker studio](../../media/sagemaker-studio.png)

Then open up Studio Classic.

Once it opens up, navigate to JumpStart solutions, choose Predictive maintenance for vehicle fleets, and launch it. It will deploy the model and create an endpoint.

![Sagemaker jumpstart](../../media/sagemaker-jumpstart.png)

## 2. Setting up Lambda function for Predictive Maintenance

## 2.1 Creating the Lambda function

Log in to AWS Console, go to Lambda functions, and click on the create function.

![Lambda creation](../../media/lambda-function-creation.png)

Provide a name ```AWSIoTVehicleFailurePredict``` for your function, be sure to choose Python 3.11 as the Runtime and click on Create function.

## 2.2 Deploying to Lambda

Now that our chat Lambda function is created, we'll deploy our code to it.

The chat function needs additional packages, namely **boto3** and **pymongo (v4.6.0)** to interface with the Sagemaker endpoint and Atlas cluster.

On your local machine, install the packages in the same folder you place lambda_function.py in. You can install packages to a specific folder using the below command

```bash
pip install --target ./ package_name
```

Zip up the contents of the entire folder (lambda_function.py and the other package folders). **Make sure the packages and the lambda function code are at the top level as shown below**

![Lambda deployment](../../media/lambda-deploy-2.png)

Now upload your zip file to an S3 bucket as it'll be too large to directly upload to your Lambda function.

Open up the Lambda function we created earlier, go to code, click on upload from and choose Amazon S3 location as shown below.

![Lambda upload](../../media/lambda-upload-s3.png)

Now enter the path to the zip file in your s3 bucket and click on Save.

## 2.3 Setting up environment variables

Open up the Lambda function, go to configuration, and configure the below environment variables

ATLAS_URI<br>
DB_NAME<br>
FAILURE_THRESHOLD<br>
SAGEMAKER_ENDPOINT<br>

![Lambda env vars](../../media/predict-env-vars.png)

Fill in the values with your cluster's connection string and your Sagemaker endpoint and save.

## 2.4 Add Required Permissions

Attach required permissions for the lambda function. It requires access to the S3 Bucket and to the Sagemaker

![Lambda Permission](../../media/lambda-sg-s3-permission.png)

## 2.5 Setting up S3 trigger

The final step is to run this function, to do that we'll set up a trigger that runs it when new sensor data is uploaded to a source S3 bucket.

As shown below, the export trigger in App Services uploads data as simple text files into your configured S3 bucket at the configured interval.

![S3 sensor data](../../media/predict-sensor-data.png)

Here the file names are the vehicle IDs (MongoDB Object IDs) and the files themselves contain the last 20 voltage and current sensor readings in the format expected by the Sagemaker endpoint.

To set up the trigger, open your Lambda function and click on Add trigger.

![Lambda trigger](../../media/lambda-s3-trigger.png)

In the Select, a source dropdown, choose S3, fill in the prefix (the one used in the export function in  the app services), check Acknowledge, and click on Add.

## 2.6 Update threshold (Optional)

You can also update the threshold value in the environment variables of the lambda. This threshold limit increases the probablity of the creation of jobs based on the current and voltage value received from the sensors.

![Threshold Value](../../media/lambda-env-threshold.png)
