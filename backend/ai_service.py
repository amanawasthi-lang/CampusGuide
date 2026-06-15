from dotenv import load_dotenv
import os

print("Current folder:", os.getcwd())

load_dotenv()

print("GROQ_API_KEY =", os.getenv("GROQ_API_KEY"))

from langchain_groq import ChatGroq

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY")
)


def ask_ai(question: str):
    response = llm.invoke(question)
    return response.content