# InterviewAI - AI-Powered Interview Preparation App

A React-based interview preparation application that uses AI to generate personalized interview questions based on your resume and job descriptions.

## Features

- 🤖 **AI-Powered Question Generation**: Uses OpenAI to create personalized interview questions
- 📄 **PDF Text Extraction**: Automatically extracts text from uploaded resumes and job descriptions
- 🔐 **Supabase Authentication**: Secure user authentication and session management
- 💾 **Session Storage**: Save and track your practice sessions
- 🎯 **Personalized Practice**: Questions tailored to your experience and target role
- 📊 **Progress Tracking**: Monitor your interview preparation progress

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **AI**: OpenAI GPT-4
- **File Processing**: PDF-parse, Multer

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd prepbot
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Backend API URL (for development)
VITE_API_URL=http://localhost:3001
```

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Create the following table in your Supabase database:

```sql
-- Create practice_sessions table
CREATE TABLE practice_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  questions_count INTEGER NOT NULL,
  question_types TEXT[] NOT NULL,
  difficulty TEXT DEFAULT 'mixed',
  score INTEGER,
  duration INTEGER,
  questions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to access only their own sessions
CREATE POLICY "Users can view own sessions" ON practice_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON practice_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON practice_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON practice_sessions
  FOR DELETE USING (auth.uid() = user_id);
```

4. Create a storage bucket for file uploads:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `uploads`
   - Set it to private

### 4. OpenAI Setup

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env` file

### 5. Test API Integration

Before running the full application, test that your API is working:

```bash
# Start the backend server
npm run server

# In another terminal, test the API
npm run test:api
```

This will test:
- Backend server connectivity
- OpenAI API integration
- Question generation functionality

### 6. Run the Application

#### Development Mode (Frontend + Backend)

```bash
npm run dev:full
```

#### Frontend Only

```bash
npm run dev
```

#### Backend Only

```bash
npm run server
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/extract-text` - Extract text from uploaded files
- `POST /api/generate-questions` - Generate interview questions using OpenAI

## Usage

1. **Sign In**: Create an account or sign in with existing credentials
2. **Upload Resume**: Upload your resume (PDF, DOC, DOCX, TXT)
3. **Add Job Description**: Paste or upload the job description
4. **Customize Session**: Select question types and count
5. **Generate Questions**: Get AI-powered personalized questions
6. **Practice**: Review questions and answer guidelines
7. **Track Progress**: Monitor your practice sessions in the History tab

## File Structure

```
prepbot/
├── src/
│   ├── lib/
│   │   ├── supabase.js      # Supabase client and helpers
│   │   └── api.js           # API service functions
│   ├── hooks/
│   │   ├── useAuth.js       # Authentication hook
│   │   └── usePracticeSessions.js # Practice sessions hook
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── server.js                # Express backend server
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
