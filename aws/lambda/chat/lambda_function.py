import os.path
import json
import pymongo
from llama_index import VectorStoreIndex, SimpleMongoReader
from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch


def lambda_handler(event, context):
  data = json.loads(event["body"])

  mongo_uri = (
      os.environ["MONGODB_CONNECTION_STRING"]
  )
  db_name = os.environ["MONGODB_DB"]
  collection_name = os.environ["MONGODB_DB_COLLECTION"]
  query_dict = {}
  field_names = ["text"]

  reader = SimpleMongoReader(uri=mongo_uri)
  documents = reader.load_data(
      db_name, collection_name, field_names, query_dict=query_dict
  )

  index = VectorStoreIndex.from_documents(documents)

  query_engine = index.as_query_engine()
  response = query_engine.query(data['question'])
  return {
      'statusCode': 200,
      'headers': {
          "Content-Type": "application/json"
      },
      'body': json.dumps({'answer': str(response).replace('"', '')})
  }