import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'), false);
    }
  }
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Extract text from PDF
app.post('/api/extract-text', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    let extractedText = '';

    if (fileExtension === '.pdf') {
      try {
        // Use a try-catch wrapper to handle the pdf-parse import issue
        let pdfParse;
        try {
          const pdfModule = await import('pdf-parse');
          pdfParse = pdfModule.default;
        } catch (importError) {
          console.error('PDF parse import error:', importError);
          throw new Error('PDF parsing library not available');
        }
        
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        extractedText = data.text;
        console.log('PDF text extracted successfully, length:', extractedText.length);
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        // For now, return a placeholder that indicates the file was received
        extractedText = `[PDF file received: ${req.file.originalname} - Text extraction temporarily unavailable. Please paste the content manually.]`;
      }
    } else if (fileExtension === '.txt') {
      extractedText = fs.readFileSync(filePath, 'utf8');
    } else if (fileExtension === '.doc' || fileExtension === '.docx') {
      // For DOC/DOCX files, use mammoth.js for text extraction
      try {
        const result = await mammoth.extractRawText({path: filePath});
        extractedText = result.value;
        console.log('DOC/DOCX text extracted successfully, length:', extractedText.length);
      } catch (docError) {
        console.error('DOC/DOCX parsing error:', docError);
        extractedText = `[DOC/DOCX file: ${req.file.originalname} - Text extraction failed. Please paste content manually.]`;
      }
    } else {
      extractedText = `[Unsupported file type: ${fileExtension} - Please use PDF, DOC, DOCX, or TXT files]`;
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({ 
      success: true, 
      text: extractedText,
      filename: req.file.originalname,
      size: req.file.size
    });

  } catch (error) {
    console.error('Error extracting text:', error);
    res.status(500).json({ error: 'Failed to extract text from file' });
  }
});

// Generate interview questions using OpenAI
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { 
      resumeText, 
      jobDescription, 
      questionCount = 5, 
      questionTypes = ['technical', 'behavioral', 'domainSpecific'],
      difficulty = 'mixed'
    } = req.body;

    if (!resumeText && !jobDescription) {
      return res.status(400).json({ error: 'Resume text or job description is required' });
    }

    // Build the prompt based on available data
    let prompt = `Generate ${questionCount} high-quality interview questions for a job candidate. `;
    
    if (resumeText) {
      // Use full resume text, but limit to 8000 characters to avoid token limits
      const resumeForPrompt = resumeText.length > 8000 ? resumeText.substring(0, 8000) + '...' : resumeText;
      prompt += `Based on this resume: ${resumeForPrompt} `;
    }
    
    if (jobDescription) {
      // Use full job description, but limit to 8000 characters to avoid token limits
      const jobDescForPrompt = jobDescription.length > 8000 ? jobDescription.substring(0, 8000) + '...' : jobDescription;
      prompt += `For this job description: ${jobDescForPrompt} `;
    }

    prompt += `\n\nRequirements:
- Generate exactly ${questionCount} questions
- Include a mix of: ${questionTypes.join(', ')} questions
- Difficulty level: ${difficulty}
- Each question should be highly relevant to the candidate's background and the job requirements
- Provide TWO types of answers for each question:
  1. answerGuide: Brief guidelines on how to approach the question
  2. sampleAnswer: A complete, detailed sample answer the candidate could give
- Questions should be specific and actionable
- Format as JSON array with fields: id (number), text (string), type (string), difficulty (string: "Easy", "Medium", "Hard"), answerGuide (string), sampleAnswer (string)

Example JSON format:
[
  {
    "id": 1,
    "text": "Describe a challenging project you worked on and how you overcame obstacles.",
    "type": "Behavioral",
    "difficulty": "Medium",
    "answerGuide": "Use the STAR method: Situation (describe the project context), Task (your responsibilities), Action (specific steps you took), Result (outcomes and learnings). Focus on problem-solving skills and collaboration.",
    "sampleAnswer": "I worked on a complex e-commerce platform where we had to integrate multiple payment gateways within a tight deadline. The situation was challenging because we had limited documentation and the APIs were constantly changing. My task was to lead the frontend integration team and ensure seamless user experience. I took several actions: first, I created a comprehensive testing strategy with mock APIs, then I established daily standups with the backend team to stay updated on changes, and finally I implemented a modular payment component that could easily adapt to API changes. The result was that we successfully launched on time with 99.9% uptime and received positive feedback from users about the smooth checkout process."
  }
]

Return only valid JSON array.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert interview coach with deep knowledge of technical interviews, behavioral assessments, and industry-specific hiring practices. Generate highly relevant, challenging, and insightful interview questions that help assess both technical skills and cultural fit. Always respond with valid JSON array format. Focus on questions that reveal problem-solving abilities, technical expertise, leadership potential, and alignment with company values."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const response = completion.choices[0].message.content;
    
    // Try to parse JSON response
    let questions;
    try {
      questions = JSON.parse(response);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse OpenAI response as JSON');
      }
    }

    res.json({ 
      success: true, 
      questions: Array.isArray(questions) ? questions : [questions],
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 