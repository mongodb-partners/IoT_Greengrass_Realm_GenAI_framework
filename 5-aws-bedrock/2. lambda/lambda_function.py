import os.path
import json

import boto3

from langchain_community.llms import Bedrock
from langchain_community.embeddings import BedrockEmbeddings
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from langchain.indexes.vectorstore import VectorStoreIndexWrapper

# Setup bedrock
bedrock_runtime = boto3.client(
    service_name="bedrock-runtime",
    region_name="us-east-1",
)

# Configurable in Lambda Environment Variables 
# eg. amazon.titan-text-lite-v1
model_id = os.environ["MODEL_ID"] 
model_kwargs =  { 
    "maxTokenCount": 4096,
    "temperature": 0.0,
    "topP": 1,
    "stopSequences": [],
}
llm = Bedrock(
    client=bedrock_runtime,
    model_id=model_id,
    model_kwargs=model_kwargs
)

MONGODB_CONNECTION_STRING = os.environ["MONGODB_CONNECTION_STRING"]

MONGODB_DB = os.environ["MONGODB_DB"]
MONGODB_DB_COLLECTION = os.environ["MONGODB_DB_COLLECTION"]

ATLAS_VECTOR_SEARCH_INDEX_NAME = os.environ["ATLAS_VECTOR_SEARCH_INDEX_NAME"]

vector_search = MongoDBAtlasVectorSearch.from_connection_string(
    MONGODB_CONNECTION_STRING,
    MONGODB_DB + "." + MONGODB_DB_COLLECTION,
    BedrockEmbeddings(client=bedrock_runtime),
    index_name=ATLAS_VECTOR_SEARCH_INDEX_NAME,
)

wrapper_store = VectorStoreIndexWrapper(vectorstore=vector_search)

def lambda_handler(event, context):   
    data = json.loads(event["body"])
    
    return {
      'statusCode': 200,
      'headers': {
          "Content-Type": "application/json"
      },
      'body': json.dumps({'answer': wrapper_store.query(data['question'], llm=llm).strip()})
    }