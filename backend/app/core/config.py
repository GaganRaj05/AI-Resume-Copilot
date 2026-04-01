from app.core import settings
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI
from llama_index.core import Settings

def configure_llama()->None:
    Settings.embed_model = OpenAIEmbedding(
        model = settings.EMBED_MODEL,
        api_key = settings.OPENAI_API_KEY,
    )
    Settings.llm = OpenAI(
        model = settings.OPENAI_MODEL,
        api_key = settings.OPENAI_API_KEY,
    )
    Settings.chunk_size = settings.CHUNK_SIZE
    Settings.chunk_overlap = settings.CHUNK_OVERLAP