# 🚀 AI-Powered Job Application Assistant

> A full-stack web application that leverages AI to streamline the job application process, helping job seekers optimize their resumes, generate personalized cover letters, and track applications efficiently.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://job-application-assistant-ejqvf9ojc.vercel.app)
[![Backend API](https://img.shields.io/badge/API-docs-blue)](https://job-application-assistant-production-5a13.up.railway.app/docs)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📸 Demo

**Live Application:** [https://job-application-assistant-ejqvf9ojc.vercel.app](https://job-application-assistant-ejqvf9ojc.vercel.app)

![Dashboard Preview](https://via.placeholder.com/800x400?text=Add+Your+Screenshot+Here)

## ✨ Features

### 🤖 AI-Powered Tools
- **Resume Analyzer** - Get instant feedback on your resume with AI-driven insights and improvement suggestions
- **Cover Letter Generator** - Create tailored, professional cover letters for any job posting in seconds
- **Job Match Analyzer** - Receive match percentages, skill comparisons, and personalized recommendations
- **ATS Compatibility Checker** - Ensure your resume passes Applicant Tracking Systems with detailed scoring

### 📊 Application Management
- **Kanban Board** - Visual drag-and-drop interface to track applications through different stages
- **Analytics Dashboard** - Real-time statistics on application status, success rates, and activity
- **Application History** - Complete record of all job applications with notes and details

### 🔐 Security & Authentication
- **Secure Authentication** - JWT-based authentication with NextAuth.js
- **Protected Routes** - Role-based access control for all endpoints
- **Password Encryption** - Industry-standard bcrypt hashing

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js v5
- **State Management:** React Hooks
- **HTTP Client:** Axios

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL with pgvector
- **ORM:** SQLAlchemy
- **Migrations:** Alembic
- **AI Integration:** OpenAI API (GPT-4)
- **File Processing:** PyPDF2, python-docx

### Infrastructure
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Railway
- **Database:** Railway PostgreSQL
- **Version Control:** Git & GitHub

## 🏗️ Architecture
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Next.js App   │ ──────> │  FastAPI Server │ ──────> │   PostgreSQL    │
│   (Frontend)    │  HTTPS  │    (Backend)    │   SQL   │    Database     │
└─────────────────┘         └─────────────────┘         └─────────────────┘
                                     │
                                     ├─> OpenAI API (GPT-4)
                                     ├─> File Storage
                                     └─> Authentication (JWT)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL 14+
- OpenAI API Key

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/gurpinders/job-application-assistant.git
cd job-application-assistant
```

#### 2. Frontend Setup
```bash
cd frontend
npm install

# Create .env.local file
echo "NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

npm run dev
```

#### 3. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=postgresql://user:password@localhost:5432/job_assistant_db
SECRET_KEY=your-jwt-secret
OPENAI_API_KEY=your-openai-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30" > .env

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

#### 4. Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## 📁 Project Structure
```
job-application-assistant/
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   ├── resume-analyzer/
│   │   ├── cover-letter/
│   │   ├── job-match/
│   │   ├── ats-check/
│   │   └── applications/
│   ├── components/
│   ├── lib/
│   └── public/
├── backend/
│   ├── alembic/
│   │   └── versions/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   ├── core/         # Config & security
│   │   └── db/           # Database connection
│   └── requirements.txt
└── README.md
```

## 🔑 Key Features Implementation

### Resume Analysis with OpenAI
```python
# Advanced prompt engineering for resume analysis
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{
        "role": "system",
        "content": "You are an expert resume reviewer..."
    }],
    temperature=0.7
)
```

### Drag-and-Drop Kanban Board
```typescript
// React Beautiful DnD implementation
const onDragEnd = (result: DropResult) => {
  // Update application status
  await updateApplicationStatus(applicationId, newStatus);
};
```

### Type-Safe API Integration
```typescript
// Full TypeScript coverage for API responses
interface ResumeAnalysis {
  id: number;
  overall_score: number;
  analysis_text: string;
  suggestions: string[];
}
```

## 📊 Database Schema
```sql
-- Core tables with relationships
users (id, email, full_name, hashed_password, ...)
resume_analyses (id, user_id, filename, analysis_text, ...)
cover_letters (id, user_id, resume_id, cover_letter_text, ...)
job_matches (id, user_id, resume_id, match_percentage, ...)
ats_checks (id, user_id, resume_id, ats_score, ...)
job_applications (id, user_id, company_name, status, ...)
```

## 🔮 Future Enhancements

- [ ] Email notifications for application deadlines
- [ ] LinkedIn integration for automatic profile import
- [ ] Interview preparation with AI-generated questions
- [ ] Salary negotiation insights and market data
- [ ] Chrome extension for one-click job saving
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Resume version history and A/B testing

## 🧪 Testing
```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
pytest
```

## 📈 Performance

- **API Response Time:** <200ms average
- **AI Analysis Time:** 3-5 seconds per resume
- **Database Queries:** Optimized with indexes
- **Frontend:** Server-side rendering with Next.js
- **Caching:** Implemented for frequently accessed data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Gurpinder Sandhu**

- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn]
- GitHub: [@gurpinders](https://github.com/gurpinders)
- Email: psandhu0124@gmail.com

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Vercel for seamless deployment
- Railway for backend hosting
- The open-source community

---

⭐ **If you find this project useful, please consider giving it a star!**