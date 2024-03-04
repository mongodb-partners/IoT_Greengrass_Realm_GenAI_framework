# Amazon Bedrock

This solution uses two models provided by Bedrock, the Titan Embeddings G1 to generate embeddings and Titan Text G1 - Lite to answer questions.

## 1. Model Access

Before you can use the LLMs provided by Bedrock, you'll need to request access to them. 

![Amazon Bedrock](../media/bedrock-2.png)

To request access to the required two Titan models, open up Model Access from the side menu.

![Amazon Bedrock](../media/bedrock-3.png)

Then click on Manage model access. This will let you choose the models you want and request for access.

![Amazon Bedrock](../media/bedrock-4.png)

Now choose the Titan Embeddings G1 and Titan Text G1 - Lite models and click on Save changes.

![Amazon Bedrock](../media/bedrock-5.png)

Request to most models should be granted fairly quickly.

## 2. Import sample data for Vehicle Knowledge Base

Import the [sample vehicle kb data](./1-generate-embeddings/data/vehicle_knowledge_base_sample.json) into a collection on your MongoDB cluster.

We use the entire document to generate embeddings, if you have your data you can simply import it into the collection instead.

## 3. Generate Embeddings

We need to install a few packages before we can generate the embeddings.

Create an environment to run [generate_embeddings.py](./1-generate-embeddings/generate_embeddings.py)

Before we can run it, we'll need to set up a few environment variables

We use Amazon's amazon.titan-embed-text-v1 model to generate embeddings, so set EMBEDDING_MODEL_ID to amazon.titan-embed-text-v1

The following, set with your AWS and MongoDB cluster information

AWS_SERVER_PUBLIC_KEY<br>
AWS_SERVER_SECRET_KEY<br>
MONGODB_CONNECTION_STRING<br>
MONGODB_DB // Database name<br>
MONGODB_DB_KB_COLLECTION // Collection in the above DB in which the vehicle kb data is stored.<br>
MONGODB_DB_EMBEDDING_COLLECTION // Collection in the above DB in which embeddings are stored.<br>
ATLAS_VECTOR_SEARCH_INDEX_NAME<br>

Example:

export AWS_SERVER_PUBLIC_KEY="AK1234OABCDGHLMN"<br>
export AWS_SERVER_SECRET_KEY="fskdsjklfsjdklfjkslj3"<br>
export MONGODB_CONNECTION_STRING="mongodb+srv://test:test@fleet-db.test.mongodb.net/?retryWrites=true&w=majority"<br>
export MONGODB_DB="GreengrassIot"<br>
export MONGODB_DB_KB_COLLECTION="vehicle_knowledge_base_sample"<br>
export ATLAS_VECTOR_SEARCH_INDEX_NAME="vector_index"<br>
export MONGODB_DB_EMBEDDING_COLLECTION="iot_chat"<br>
export EMBEDDING_MODEL_ID="amazon.titan-embed-text-v1"<br>

Open up Atlas, go to your project and Atlas Search and create an Atlas Vector Search index on your cluster following the steps at [Create an Atlas Vector Search Index](https://www.mongodb.com/docs/atlas/atlas-vector-search/create-index/#create-an-atlas-vector-search-index)

Use the following for the index definition and save it. Choose the database and collection into which the embeddings will be stored.

```json
{
  "fields": [{
    "type": "vector",
    "path": "embedding",
    "numDimensions": 1536,
    "similarity": "cosine"
  }]
}
```

You should now have an index setup as shown below

![AVS Index](../media/avs-index.png)

Finally run [generate_embeddings.py](./1-generate-embeddings/generate_embeddings.py) to generate embeddings.

## 4. Set up AWS Lambda function to provide an endpoint for Field Techinician's Mobile Application

Log in to AWS Console, go to Lambda functions, and click on the create function.

![Lambda creation](../media/lambda-function-creation.png)

Provide a name for your function ```greengrass_chatendpoint```, be sure to choose Python 3.11 as the Runtime and click on create function.

### 4.1 Deploying to Lambda

Now that our chat Lambda function is created, we'll deploy our code to it.

On your local machine, install the packages in the same folder you place lambda_function.py in. You can install packages to a specific folder ```5-aws-bedrock/2-lambda``` using the below command

```bash
pip install --target ./ package_name
```
example ```pip install --target ./  langchain langchain_community pymongo boto3```

Zip up the contents of the entire folder (lambda_function.py and the other package folders). **Make sure the packages and the lambda function code are at the top level as shown below**

![Lambda deployment](../media/lambda-deploy-1.png)

Now upload your zip file to an S3 bucket as it'll be too large to directly upload to your Lambda function.

Open up the Lambda function we created earlier, go to code, click on upload from and choose Amazon S3 location as shown below.

![Lambda upload](../media/lambda-upload-s3.png)

Now enter the path to the zip file in your s3 bucket and click on Save.

### 4.2 Setting up environment variables

Open up the Lambda function, go to configuration, and configure the below environment variables

ATLAS_VECTOR_SEARCH_INDEX_NAME<br>
MODEL_ID = amazon.titan-text-lite-v1 <br>
MONGODB_CONNECTION_STRING<br>
MONGODB_DB<br>
MONGODB_DB_COLLECTION<br>



![Lambda env vars](../media/chat-env-vars.png)

Fill in the values with your cluster's connection string, db name, and collection name, and save.
