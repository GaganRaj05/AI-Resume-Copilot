from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core import StorageContext
from llama_index.core.vector_stores import (
    MetadataFilter,
    MetadataFilters,
    FilterOperator,
    FilterCondition,
)
import logging
from app.services.chroma_client import get_chroma_collection_sync
from app.core import settings
import asyncio

logger = logging.getLogger(__name__)
embed_model = OpenAIEmbedding(
    model = settings.EMBED_MODEL,
    api_key = settings.OPENAI_API_KEY
)

async def vector_search( query: str, top_k: int = 5) -> str:
    try:
        resume_collection = get_chroma_collection_sync(
                name=settings.CHROMA_COLLECTION
            )
#         query_embedding = embed_model.get_text_embedding(query)
#         results = resume_collection.query(
#     query_embeddings=[query_embedding],
#     where = {
#     "$and": [
#         {"user_id": "69d1618d19b73b58a1b89e90"},
#         {"source_document_id": "556bb221-ebbb-4e13-b9af-a20d448555d5"}
#     ]
# },
#     n_results=5
# )
#         return results
        vector_store = ChromaVectorStore(chroma_collection=resume_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)

        index = VectorStoreIndex.from_vector_store(
                vector_store, storage_context=storage_context, embed_model = embed_model
            )
        filters = MetadataFilters(
    filters=[
        MetadataFilter(
            key="user_id",
            operator=FilterOperator.EQ,
            value="69d1618d19b73b58a1b89e90",
        ),
        MetadataFilter(
            key="source_document_id",
            operator=FilterOperator.EQ,
            value="556bb221-ebbb-4e13-b9af-a20d448555d5",
        ),
    ],
    condition=FilterCondition.AND,
)

        retriever = index.as_retriever(
            similarity_top_k=top_k,
            filters = filters
        )

        nodes = retriever.retrieve(query)
        
        if not nodes:
                return "No resume content found for this user"

        for node in nodes:
            print(node.node.metadata)
        chunks = [node.node.get_content() for node in nodes]

        return "\n\n---\n\n".join(   
                f"[Chunk {i+1}]\n{c}" for i, c in enumerate(chunks)
            )
    except Exception as e:
        logger.error(f"An error occured while retrieving chunks, Error\n{str(e)}")
        raise e

async def main():
    result = await vector_search(query="async", top_k=5)
    print(f"result:{result}")
    
if __name__ == "__main__":
    asyncio.run(main())