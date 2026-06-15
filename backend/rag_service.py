from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import os

VECTOR_DB_PATH = "faiss_db"

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


def process_pdf(pdf_path):
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_documents(documents)

    # Load existing FAISS database if present
    if os.path.exists(VECTOR_DB_PATH):

        vectorstore = FAISS.load_local(
            VECTOR_DB_PATH,
            embeddings,
            allow_dangerous_deserialization=True
        )

        vectorstore.add_documents(chunks)

    else:

        vectorstore = FAISS.from_documents(
            chunks,
            embeddings
        )

    vectorstore.save_local(VECTOR_DB_PATH)

    return len(chunks)


def search_pdf(question):
    if not os.path.exists(VECTOR_DB_PATH):
        return ""

    vectorstore = FAISS.load_local(
        VECTOR_DB_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )

    docs_with_scores = vectorstore.similarity_search_with_score(
        question,
        k=10
    )

    filtered_docs = []

    for doc, score in docs_with_scores:
        # Lower score = better match
        if score < 1.0:
            filtered_docs.append(doc)

    # Fallback if filter removes everything
    if not filtered_docs:
        filtered_docs = [doc for doc, score in docs_with_scores[:3]]

    context = "\n\n".join(
        [doc.page_content for doc in filtered_docs]
    )

    return context