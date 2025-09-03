# InterviewAI - AI-Powered Interview Preparation Platform

A comprehensive interview preparation application that uses AI to generate personalized questions based on your resume and job descriptions.

## 🏗️ Project Structure

```
interviewai-prepbot/
├── frontend/          # React + Vite frontend application
│   ├── src/          # React source code
│   ├── public/       # Static assets
│   ├── package.json  # Frontend dependencies
│   └── vite.config.js # Vite configuration
├── backend/           # Node.js + Express backend
│   ├── server.js     # Express server
│   └── supabase/     # Supabase configuration & functions
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## 🚀 Features

- **AI-Powered Questions**: Generate personalized interview questions based on resume and job description
- **Practice Sessions**: Record and practice your answers with microphone support
- **Session History**: Track your progress and review past practice sessions
- **User Authentication**: Secure sign-up/sign-in with Supabase
- **Responsive Design**: Modern, mobile-friendly UI built with Tailwind CSS

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Authentication and database

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Supabase** - Backend-as-a-Service

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### 1. Clone the repository

```bash
git clone https://github.com/Kamaal2002/interviewai-prepbot.git
cd interviewai-prepbot
```

### 2. Setup Backend

```bash
cd backend
npm install
# Create .env file with your Supabase credentials
npm start
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

## 🚀 Usage

1. **Sign up/Login** to your account
2. **Upload your resume** (PDF, DOCX, TXT)
3. **Enter job description** for the position you're applying to
4. **Generate questions** based on your profile
5. **Practice answering** with microphone recording
6. **Review sessions** and track your progress

## 📱 Available Scripts

### Frontend

```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend

```bash
cd backend
npm start        # Start production server
npm run dev      # Start development server (if nodemon is configured)
```

## 🌐 Deployment

### Frontend

- Deploy to Vercel, Netlify, or GitHub Pages
- Build command: `npm run build`
- Output directory: `dist/`

### Backend

- Deploy to Heroku, Railway, or any Node.js hosting
- Ensure environment variables are set

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Kamaal Alag** - [GitHub](https://github.com/Kamaal2002)

---

⭐ **Star this repository if you find it helpful!**
