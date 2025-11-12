# 🎯 AI-Powered Job Application Assistant

A full-stack web application that helps job seekers optimize their resumes, generate personalized cover letters, analyze job matches, check ATS compatibility, and track applications through an interactive Kanban board.

**Live Demo:** [Coming Soon]

---

## ✨ Features

### 📄 Resume Analysis
- Upload PDF or DOCX resumes
- AI-powered analysis using OpenAI GPT
- Get scores, feedback, and actionable suggestions
- View complete analysis history

### ✉️ Cover Letter Generator
- AI-generated personalized cover letters
- Tailored to specific job descriptions
- Uses your resume data for customization
- Professional formatting

### 🎯 Job Match Analyzer
- Compare your resume against job descriptions
- Get match percentage scores
- See matching and missing skills
- Receive improvement suggestions

### ✅ ATS Compatibility Checker
- Analyze resume ATS-friendliness
- Get compatibility scores (0-100)
- Identify formatting issues
- Receive optimization recommendations

### 📊 Application Tracker
- Interactive Kanban board (Applied, Interview, Offer, Rejected)
- Drag-and-drop cards between stages
- Track company, position, salary, dates, and notes
- Full CRUD operations (Create, Read, Update, Delete)

### 🔐 Authentication System
- Secure user registration and login
- JWT-based authentication
- Protected routes
- Session management with NextAuth.js

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js v5
- **HTTP Client:** Axios
- **Drag & Drop:** @dnd-kit

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL with pgvector
- **ORM:** SQLAlchemy
- **Migrations:** Alembic
- **Authentication:** JWT with bcrypt
- **AI Integration:** OpenAI API (GPT-3.5/4)
- **File Parsing:** PyPDF2, python-docx

---

## 📸 Screenshots

[Add screenshots here of your key features - Dashboard, Resume Analysis, Kanban Board, etc.]

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 14+
- OpenAI API key

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/job-application-assistant.git
cd job-application-assistant
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

**Configure backend `.env`:**
```env
DATABASE_URL=postgresql://username:password@localhost/job_assistant_db
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_secret_key_here
```

**Set up database:**
```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE job_assistant_db;
\c job_assistant_db
CREATE EXTENSION vector;
\q

# Run migrations
alembic upgrade head

# Start backend
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`

#### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local
```

**Configure frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

**Start frontend:**
```bash
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 📁 Project Structure
```
job-application-assistant/
├── backend/
│   ├── app/
│   │   ├── api/          # API route handlers
│   │   ├── core/         # Security & config
│   │   ├── db/           # Database connection
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic (OpenAI)
│   │   └── utils/        # Helper functions
│   ├── alembic/          # Database migrations
│   └── uploads/          # Resume file storage
│
├── frontend/
│   ├── app/              # Next.js pages (App Router)
│   ├── components/       # Reusable components
│   └── public/           # Static assets
│
└── PROJECT_CHECKLIST.md  # Development progress
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Resume Analysis
- `POST /api/resume/upload` - Upload and analyze resume
- `GET /api/resume/{id}` - Get analysis by ID
- `GET /api/resume/user/{user_id}` - Get user's analyses

### Cover Letter
- `POST /api/cover-letter/generate` - Generate cover letter

### Job Match
- `POST /api/job-match/analyze` - Analyze job match

### ATS Check
- `POST /api/ats-check/check` - Check ATS compatibility

### Applications
- `POST /api/applications` - Create application
- `GET /api/applications/user/{user_id}` - Get user's applications
- `PUT /api/applications/{id}` - Update application
- `PATCH /api/applications/{id}/status` - Update status
- `DELETE /api/applications/{id}` - Delete application

Full API documentation available at: `http://localhost:8000/docs`

---

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack development with modern frameworks
- RESTful API design and implementation
- Database design and migrations
- JWT authentication and security
- AI/ML integration (OpenAI API)
- File upload and processing
- Interactive UI with drag-and-drop
- State management in React
- TypeScript type safety
- Responsive design with Tailwind CSS

---

## 🔮 Future Enhancements

- [ ] Dashboard analytics with charts
- [ ] Email notifications for deadlines
- [ ] Resume version comparison
- [ ] Export data as PDF/CSV
- [ ] Interview preparation module
- [ ] Salary insights
- [ ] Browser extension

---

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome! Feel free to open an issue or submit a pull request.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Your Name**
- Portfolio: [portfolio-website-tau-sand.vercel.app]
- LinkedIn: [linkedin.com/in/yourprofile]
- GitHub: [@gurpinder](https://github.com/yourusername)
- Email: psandhu0124@gmail.com

---

## 🙏 Acknowledgments

- OpenAI for GPT API
- Next.js and FastAPI communities
- All open-source contributors

---

**Built as a portfolio project to demonstrate full-stack development skills**