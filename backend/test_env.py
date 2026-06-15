from dotenv import load_dotenv
import os

result = load_dotenv(dotenv_path=".env")

print("Loaded:", result)
print("File exists:", os.path.exists(".env"))
print("KEY:", os.getenv("GROQ_API_KEY"))