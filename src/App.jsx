import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Brain } from 'lucide-react';
import { auth } from './lib/supabase';
import { extractTextFromFile, generatePersonalizedQuestions, savePracticeSession, getUserSessions } from './lib/api';

// Import components
import Navigation from './components/Navigation';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginPage';
import PracticePage from './components/PracticePage';
import HistoryPage from './components/HistoryPage';
import SessionReviewModal from './components/SessionReviewModal';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('practice');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState({
    technical: false,
    behavioral: false,
    domainSpecific: false
  });
  const [difficultyPreferences, setDifficultyPreferences] = useState({
    easy: 0,
    medium: 0,
    hard: 0
  });
  
  // Computed total questions from difficulty preferences
  const totalDifficultyQuestions = difficultyPreferences.easy + difficultyPreferences.medium + difficultyPreferences.hard;
  const [questionsGenerated, setQuestionsGenerated] = useState(false);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [expandedSampleAnswers, setExpandedSampleAnswers] = useState({});
  const [questionCount, setQuestionCount] = useState(5);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const jobDescTextareaRef = useRef('');
  // Extracted text from files
  const [resumeText, setResumeText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isResumeProcessing, setIsResumeProcessing] = useState(false);
  const [showFullScreenLoader, setShowFullScreenLoader] = useState(false);
  const [recordingStates, setRecordingStates] = useState({});
  const [recordingTimes, setRecordingTimes] = useState({});
  const [audioUrls, setAudioUrls] = useState({});
  
  // User sessions state
  const [userSessions, setUserSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Auth states
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Use refs to avoid re-renders for auth forms
  const emailRef = useRef('');
  const passwordRef = useRef('');
  
  // Microphone recording refs
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);

  // Mock data for fallback
  const mockQuestions = [
    {
      id: 1,
      text: "Tell me about a challenging project you worked on and how you overcame obstacles.",
      type: "behavioral",
      difficulty: "Medium",
      answerGuide: "Use the STAR method: Situation, Task, Action, Result. Be specific about the challenge and your role.",
      sampleAnswer: "In my previous role, I led a team of 5 developers to build a customer portal..."
    },
    {
      id: 2,
      text: "How would you optimize the performance of a slow-loading web application?",
      type: "technical",
      difficulty: "Hard",
      answerGuide: "Discuss profiling, caching strategies, code optimization, and infrastructure improvements.",
      sampleAnswer: "I would start by profiling the application to identify bottlenecks..."
    }
  ];

  const mockHistory = [
    { 
      id: 1, 
      title: "Technical Interview Practice",
      score: 85,
      difficulty: "Medium",
      duration: "45 min",
      questions: 5, 
      date: "2024-01-15",
      created_at: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      title: "Behavioral Questions Session",
      score: 92,
      difficulty: "Easy",
      duration: "30 min",
      questions: 3,
      date: "2024-01-14",
      created_at: "2024-01-14T14:30:00Z"
    }
  ];

  // Simple handlers that don't cause re-renders
  const handleEmailChange = (e) => {
    emailRef.current = e.target.value;
  };

  const handlePasswordChange = (e) => {
    passwordRef.current = e.target.value;
  };

  const handleJobDescChange = (e) => {
    jobDescTextareaRef.current = e.target.value;
  };

  // Microphone recording functions
  const startRecording = async (questionId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        
        setAudioUrls(prev => ({
          ...prev,
          [questionId]: audioUrl
        }));
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setRecordingStates(prev => ({ ...prev, [questionId]: true }));
      setRecordingTimes(prev => ({ ...prev, [questionId]: 0 }));
      
      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTimes(prev => ({
          ...prev,
          [questionId]: (prev[questionId] || 0) + 1
        }));
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = (questionId) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingStates(prev => ({ ...prev, [questionId]: false }));
      
      // Clear timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const clearRecording = (questionId) => {
    setAudioUrls(prev => {
      const newUrls = { ...prev };
      delete newUrls[questionId];
      return newUrls;
    });
    setRecordingTimes(prev => {
      const newTimes = { ...prev };
      delete newTimes[questionId];
      return newTimes;
    });
  };

  // Authentication functions
  const checkAuthState = async () => {
    try {
      const { data: { user } } = await auth.getCurrentUser();
      if (user) {
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
      } else {
        setIsLoggedIn(false);
        setCurrentPage('welcome');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setIsLoggedIn(false);
      setCurrentPage('welcome');
    } finally {
      setIsInitializing(false);
    }
  };

  // Load user sessions
  const loadUserSessions = useCallback(async () => {
    if (!isLoggedIn) return;
    
    setSessionsLoading(true);
    try {
      const { data: { user } } = await auth.getCurrentUser();
      if (user) {
        const sessions = await getUserSessions(user.id);
        setUserSessions(sessions || []);
      }
    } catch (error) {
      console.error('Error loading user sessions:', error);
      setUserSessions([]);
    } finally {
      setSessionsLoading(false);
      setSessionsLoaded(true);
    }
  }, [isLoggedIn]);

  // Auth handlers
  const handleGuestMode = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogOut = () => {
    auth.signOut();
    setIsLoggedIn(false);
    setCurrentPage('welcome');
    setUserSessions([]);
    setSessionsLoaded(false);
    setDifficultyPreferences({ easy: 0, medium: 0, hard: 0 });
  };

  const handleReviewSession = (session) => {
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  // Preference handlers
  const togglePreference = (pref) => {
    setSelectedPreferences(prev => ({
      ...prev,
      [pref]: !prev[pref]
    }));
  };

  // Question generation
  const generateQuestions = async () => {
    if (!Object.values(selectedPreferences).some(Boolean)) {
      alert('Please select at least one question type.');
      return;
    }

      setIsProcessing(true);
    setShowFullScreenLoader(true);
      
    try {
      const finalResumeText = resumeText || (uploadedResume ? 'Resume uploaded but text extraction failed' : '');
      const finalJobDescText = jobDescTextareaRef.current || '';
      
      const selectedTypes = Object.keys(selectedPreferences).filter(key => selectedPreferences[key]);
      
      // Use difficulty preferences if set, otherwise use questionCount
      const finalQuestionCount = totalDifficultyQuestions > 0 ? totalDifficultyQuestions : questionCount;
      
      const result = await generatePersonalizedQuestions({
        resumeText: finalResumeText,
        jobDescription: finalJobDescText,
        questionCount: finalQuestionCount,
        questionTypes: selectedTypes,
        difficulty: 'mixed'
      });

      if (result.success && result.questions) {
        setGeneratedQuestions(result.questions);
      setQuestionsGenerated(true);
      
        // Save session to database if user is logged in
        if (isLoggedIn) {
          try {
            console.log('generateQuestions: User is logged in, attempting to save session');
            const { data: { user } } = await auth.getCurrentUser();
            console.log('generateQuestions: Current user:', user.id);
            
            const sessionData = {
              user_id: user.id,
              title: `Practice Session - ${selectedTypes.join(', ')}`,
              resume_text: finalResumeText,
              job_description_text: finalJobDescText,
              question_count: result.questions.length,
              questions: result.questions,
              score: Math.floor(Math.random() * 30) + 70, // Mock score for now
              difficulty: 'Mixed',
              duration: '30 min'
            };
            
            console.log('generateQuestions: Saving session data:', sessionData);
            await savePracticeSession(sessionData);
            console.log('Practice session saved to Supabase successfully');
            
            // Reload sessions to include the new one
            await loadUserSessions();
      
    } catch (error) {
            console.error('Error saving practice session:', error);
          }
        }
      } else {
        console.error('Failed to generate questions:', result);
        alert('Failed to generate questions. Please try again.');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Error generating questions. Please check your connection and try again.');
    } finally {
      setIsProcessing(false);
      setShowFullScreenLoader(false);
    }
  };

  // Question interaction handlers
  const toggleAnswer = (questionId) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const toggleSampleAnswer = (questionId) => {
    setExpandedSampleAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // File upload handlers
  const handleResumeUpload = async (file) => {
    setUploadedResume(file);
    setIsResumeProcessing(true);
    
    try {
      const result = await extractTextFromFile(file);
      if (result.success) {
      setResumeText(result.text);
        console.log('Resume text extracted:', result.text);
      } else {
        console.error('Failed to extract resume text:', result.error);
        alert('Failed to extract text from resume. Please try again.');
      }
    } catch (error) {
      console.error('Failed to extract resume text:', error);
      alert('Failed to extract text from resume. Please try again.');
    } finally {
      setIsResumeProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleResumeUpload(files[0]);
    }
  };

  // Auth form handlers
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (isSignUp) {
        const { error } = await auth.signUp(emailRef.current, passwordRef.current);
        if (error) throw error;
        alert('Account created successfully! Please check your email to verify your account.');
      } else {
        const { error } = await auth.signIn(emailRef.current, passwordRef.current);
        if (error) throw error;
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Helper functions
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-600 bg-emerald-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'technical': return '💻';
      case 'behavioral': return '🤝';
      case 'domainSpecific': return '🎯';
      default: return '❓';
    }
  };

  // Cleanup recordings when questions change
  useEffect(() => {
    return () => {
      // Cleanup recordings on unmount
      Object.values(audioUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [audioUrls]);

  useEffect(() => {
    // Cleanup recordings when questions change
    Object.values(audioUrls).forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });
    setAudioUrls({});
    setRecordingStates({});
    setRecordingTimes({});
  }, [questionsGenerated]);

  // Check auth state on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  console.log('Current page:', currentPage);

  // Show loading screen while checking authentication
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  );
  }

  if (currentPage === 'welcome') {
    return <WelcomePage setCurrentPage={setCurrentPage} handleGuestMode={handleGuestMode} />;
  }

  if (currentPage === 'login') {
    return (
      <LoginPage 
        isSignUp={isSignUp}
        setIsSignUp={setIsSignUp}
        authError={authError}
        authLoading={authLoading}
        handleEmailChange={handleEmailChange}
        handlePasswordChange={handlePasswordChange}
        handleAuthSubmit={handleAuth}
        setCurrentPage={setCurrentPage}
        handleGuestMode={handleGuestMode}
      />
    );
  }

  // Full-screen loader for question generation
  if (showFullScreenLoader) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center z-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
          </div>
          </div>
        </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Generating Questions</h2>
          <p className="text-slate-600 mb-6">Our AI is analyzing your resume and job description to create personalized interview questions...</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
                </div>
            </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Navigation 
        isLoggedIn={isLoggedIn}
        showUserDropdown={showUserDropdown}
        setShowUserDropdown={setShowUserDropdown}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogOut={handleLogOut}
      />
      <main className="flex-1 py-8">
        {activeTab === 'practice' ? (
          <PracticePage
            authError={authError}
            questionsGenerated={questionsGenerated}
            uploadedResume={uploadedResume}
            isDragOver={isDragOver}
            isResumeProcessing={isResumeProcessing}
            jobDescTextareaRef={jobDescTextareaRef}
            questionCount={questionCount}
            selectedPreferences={selectedPreferences}
            difficultyPreferences={difficultyPreferences}
            totalDifficultyQuestions={totalDifficultyQuestions}
            isProcessing={isProcessing}
            showFullScreenLoader={showFullScreenLoader}
            generatedQuestions={generatedQuestions}
            mockQuestions={mockQuestions}
            recordingStates={recordingStates}
            recordingTimes={recordingTimes}
            audioUrls={audioUrls}
            expandedAnswers={expandedAnswers}
            expandedSampleAnswers={expandedSampleAnswers}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            handleResumeUpload={handleResumeUpload}
            setUploadedResume={setUploadedResume}
            handleJobDescChange={handleJobDescChange}
            setQuestionCount={setQuestionCount}
            togglePreference={togglePreference}
            setDifficultyPreferences={setDifficultyPreferences}
            generateQuestions={generateQuestions}
            setQuestionsGenerated={setQuestionsGenerated}
            getDifficultyColor={getDifficultyColor}
            getTypeIcon={getTypeIcon}
            formatTime={formatTime}
            toggleAnswer={toggleAnswer}
            toggleSampleAnswer={toggleSampleAnswer}
            startRecording={startRecording}
            stopRecording={stopRecording}
            clearRecording={clearRecording}
          />
        ) : (
          <HistoryPage
            isLoggedIn={isLoggedIn}
            sessionsLoaded={sessionsLoaded}
            userSessions={userSessions}
            sessionsLoading={sessionsLoading}
            mockHistory={mockHistory}
            loadUserSessions={loadUserSessions}
            handleReviewSession={handleReviewSession}
            setActiveTab={setActiveTab}
          />
        )}
      </main>
      <SessionReviewModal
        showSessionModal={showSessionModal}
        selectedSession={selectedSession}
        setShowSessionModal={setShowSessionModal}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

export default App; 