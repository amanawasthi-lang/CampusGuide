from fastapi import FastAPI, Depends, UploadFile, File
from rag_service import process_pdf
from rag_service import search_pdf
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from ai_service import ask_ai
from database import engine, SessionLocal
from models import Base, User

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CampusGuide AI")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {
        "message": "CampusGuide AI Backend Running"
    }


@app.post("/signup")
def signup(
    name: str,
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        return {
            "message": "Email already registered"
        }

    user = User(
        name=name,
        email=email,
        password=password,
        role="student"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User Created Successfully",
        "user_id": user.id
    }


@app.post("/login")
def login(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == email,
        User.password == password
    ).first()

    if not user:
        return {
            "message": "Invalid Email or Password"
        }

    return {
        "message": "Login Successful",
        "user_id": user.id,
        "role": user.role,
        "name": user.name
    }
@app.post("/ask")
def ask(question: str):

    context = search_pdf(question)

    prompt = f"""
You are CampusGuide AI, a university assistant.

Use ONLY the information provided in the context below.

Rules:
1. Answer only from the context.
2. Keep the answer short (1-3 sentences).
3. Do not add extra information.
4. Do not explain your reasoning.
5. If the answer is not found in the context, reply exactly:
Information not found in university documents.

Context:
{context}

Question:
{question}

Final Answer:
"""

    answer = ask_ai(prompt)

    return {
        "answer": answer
    }

import os

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    chunks = process_pdf(file_path)

    return {
        "message": "PDF processed successfully",
        "filename": file.filename,
        "chunks": chunks
    }