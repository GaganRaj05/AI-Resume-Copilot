# 🚀 AI Resume Copilot

An **agentic AI-powered backend system** that analyzes, improves, and tailors resumes based on job descriptions using tool-driven reasoning.

Unlike typical GPT wrappers, this system uses a **LangChain-based AI agent** that evaluates resumes, identifies gaps, and iteratively improves them using structured tools and retrieval.

---

## 🧠 Overview

AI Resume Copilot is designed to simulate an intelligent career assistant that:

* Understands your resume deeply
* Matches it against job descriptions
* Identifies missing skills and gaps
* Iteratively improves the resume
* Generates tailored cover letters

> ⚡ Built as a backend-first system with scalable microservices and async processing.

---

## ✨ Key Features

### 📄 Resume Management

* Upload and store multiple resumes per user
* Background processing using Celery
* Resume parsing and embedding via LlamaIndex

### 🤖 Agentic Resume Tailoring

* AI Agent built with LangChain
* Tool-based architecture:

  * `vector_search` → retrieves resume context
  * `job_matcher` → evaluates alignment + returns match score
  * `tailor_resume` → improves resume content
* Iterative refinement loop based on match score

### 🧾 Cover Letter Generation

* Generate personalized cover letters for selected resumes
* Stored and retrievable per user

### 🔐 Authentication System

* JWT-based authentication (cookies)
* Google OAuth integration
* OTP-based email verification

### ⚙️ Scalable Architecture

* Fully Dockerized services
* Independently scalable components:

  * FastAPI backend
  * Celery workers
  * Redis (broker + caching)
  * Chroma vector DB

---

## 🏗️ Architecture

```
                ┌──────────────┐
                │   Client     │
                └──────┬───────┘
                       │
                ┌──────▼───────┐
                │   FastAPI    │
                │   Backend    │
                └──────┬───────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
│  MongoDB     │ │  ChromaDB │ │   Redis     │
│ (Beanie ODM) │ │ Vector DB │ │ (Cache/Queue│
└──────────────┘ └───────────┘ └──────┬──────┘
                                      │
                               ┌──────▼──────┐
                               │   Celery    │
                               │   Workers   │
                               └──────┬──────┘
                                      │
                               ┌──────▼──────┐
                               │ LlamaIndex  │
                               │ + LangChain │
                               └─────────────┘
```

---

## 🔁 AI Pipeline

### 📥 Resume Upload Flow

1. User uploads resume
2. File stored locally
3. Celery background task triggered
4. LlamaIndex:

   * Parses resume
   * Generates embeddings
5. Stored in ChromaDB

---

### 🎯 Resume Tailoring Flow

1. User provides job description
2. LangChain Agent is initialized
3. Agent uses tools:

   * `vector_search` → fetch resume context
   * `job_matcher` → compute match score + gaps
   * `tailor_resume` → rewrite/improve content
4. Iterative refinement loop
5. Final resume saved to DB
6. Optional:

   * Cover letter generated
   * Email dispatched via Celery

---

## 🧰 Tech Stack

| Layer            | Technology                      |
| ---------------- | ------------------------------- |
| Backend          | FastAPI                         |
| AI Orchestration | LangChain, LlamaIndex           |
| Embeddings       | OpenAI `text-embedding-3-small` |
| Vector DB        | Chroma (HTTP server)            |
| Database         | MongoDB + Beanie ODM            |
| Queue            | Celery + Redis                  |
| Auth             | JWT + Google OAuth              |
| Storage          | Local filesystem                |
| Containerization | Docker + Docker Compose         |

---

## 📡 API Endpoints

### 🔐 Auth Routes

```
/api/v1/auth/sign-in
/api/v1/auth/sign-up
/api/v1/auth/generate-otp
/api/v1/auth/validate-otp
/api/v1/auth/google-auth
/api/v1/auth/check-auth
```

### 📄 Document Routes

```
/api/v1/docs/upload
/api/v1/docs/status/{task_id}
/api/v1/docs/tailor-resume
/api/v1/docs/generate-cover-letter
/api/v1/docs/get-cover-letter
/api/v1/docs/get-resumes
/api/v1/docs/get-tailored-docs
/api/v1/docs/get-resume
/api/v1/docs/get-tailored-resume
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/AI-Resume-Copilot.git
cd AI-Resume-Copilot
```

### 2. Configure Environment

Create a `.env` file based on `.env.example`

```env
OPENAI_API_KEY=
CLAUDE_API_KEY=
MONGODB_URL=
MONGODB_NAME=
REDIS_URL=
CHROMA_HOST=
SECRET_KEY=
ALGORITHM=
GOOGLE_CLIENT_ID=
FRONTEND_URL=
```

---

### 3. Run with Docker

```bash
docker-compose up --build
```

---

### 4. Access API Docs

```
http://localhost:8000/docs
```

---

## 🧪 Testing

* APIs tested using Postman
* Background task status tracked via `/status/{task_id}`
* Logging implemented for debugging and observability

---

## 🚀 Future Enhancements

* 💬 Chat-based agent interaction (section-wise resume editing)
* 📊 Advanced ATS scoring system
* 🤖 Autonomous job application agent
* 🔍 Job scraping + matching pipeline
* 🌐 Frontend integration (in progress)

---

## ⚠️ Disclaimer

This project is built for **learning and demonstration purposes** and is not deployed as a production SaaS.

---

## 👨‍💻 Author

**Gagan Raj**
AI Engineer 

---

## ⭐ Final Note

This project focuses on **agentic workflows over simple prompt-based generation**, showcasing how AI systems can:

* Reason over structured tools
* Iterate based on feedback (match score)
* Integrate retrieval + generation pipelines

---
