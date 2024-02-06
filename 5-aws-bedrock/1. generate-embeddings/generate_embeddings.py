import os

from langchain_community.document_loaders import MongodbLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from pymongo import MongoClient

import boto3

session = boto3.Session(
    aws_access_key_id=os.environ["AWS_SERVER_PUBLIC_KEY"],
    aws_secret_access_key=os.environ["AWS_SERVER_SECRET_KEY"],
)

# Setup bedrock
bedrock_runtime = session.client(
    service_name="bedrock-runtime",
    region_name="us-east-1",
)

from langchain_community.embeddings import BedrockEmbeddings

# create embeddings
bedrock_embedding = BedrockEmbeddings(
    client=bedrock_runtime,
    model_id=os.environ["EMBEDDING_MODEL_ID"],
)

MONGODB_CONNECTION_STRING = os.environ["MONGODB_CONNECTION_STRING"]

MONGODB_DB = os.environ["MONGODB_DB"]
MONGODB_DB_COLLECTION = os.environ["MONGODB_DB_KB_COLLECTION"]

ATLAS_VECTOR_SEARCH_INDEX_NAME = os.environ["ATLAS_VECTOR_SEARCH_INDEX_NAME"]

loader = MongodbLoader(
    connection_string=MONGODB_CONNECTION_STRING,    
    db_name=MONGODB_DB,
    collection_name=MONGODB_DB_COLLECTION,
    filter_criteria={},
)

docs = loader.load()
print(f"documents:loaded:size={len(docs)}")

docs = CharacterTextSplitter(chunk_size=2000, chunk_overlap=400, separator=",").split_documents(docs)
print(f"Documents:after split and chunking size={len(docs)}")

client = MongoClient(MONGODB_CONNECTION_STRING)
db = client[MONGODB_DB]
MONGODB_COLLECTION = db[os.environ["MONGODB_DB_EMBEDDING_COLLECTION"]]

_ = MongoDBAtlasVectorSearch.from_documents(
    documents=docs,
    embedding=bedrock_embedding,
    collection=MONGODB_COLLECTION,
    index_name=ATLAS_VECTOR_SEARCH_INDEX_NAME,
)