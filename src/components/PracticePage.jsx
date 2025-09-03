import React from 'react';
import { 
  Zap, Upload, FileText, Sparkles, Briefcase, Target, 
  Minus, Plus, Code, MessageSquare, CheckCircle2, Brain 
} from 'lucide-react';
import QuestionsDisplay from './QuestionsDisplay';

const PracticePage = ({
  authError,
  questionsGenerated,
  uploadedResume,
  isDragOver,
  isResumeProcessing,
  jobDescTextareaRef,
  questionCount,
  selectedPreferences,
  difficultyPreferences,
  totalDifficultyQuestions,
  isProcessing,
  showFullScreenLoader,
  generatedQuestions,
  mockQuestions,
  recordingStates,
  recordingTimes,
  audioUrls,
  expandedAnswers,
  expandedSampleAnswers,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleResumeUpload,
  setUploadedResume,
  handleJobDescChange,
  setQuestionCount,
  togglePreference,
  setDifficultyPreferences,
  generateQuestions,
  setQuestionsGenerated,
  getDifficultyColor,
  getTypeIcon,
  formatTime,
  toggleAnswer,
  toggleSampleAnswer,
  startRecording,
  stopRecording,
  clearRecording
}) => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          <Zap className="w-4 h-4" />
          <span>AI-Powered Practice</span>
        </div>
        <h2 className="text-4xl font-bold text-slate-900">Personalized Interview Preparation</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Upload your resume and customize your practice session for the most relevant interview questions
        </p>
      </div>

      {authError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 max-w-2xl mx-auto">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center mt-0.5">
              <span className="text-red-600 text-sm font-bold">!</span>
            </div>
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-700 text-sm">{authError}</p>
            </div>
          </div>
        </div>
      )}

      {!questionsGenerated ? (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {/* Left Column - Resume Upload */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Upload Resume</h3>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 ${
                  isDragOver
                    ? 'border-blue-400 bg-blue-50'
                    : uploadedResume
                    ? 'border-green-400 bg-green-50'
                    : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploadedResume ? (
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{uploadedResume.name}</p>
                      <p className="text-slate-500">{uploadedResume.size}</p>
                    </div>
                    <button
                      onClick={() => setUploadedResume(null)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Upload Different File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900">Drop your resume here</p>
                      <p className="text-sm text-slate-500">or click to browse files</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => e.target.files[0] && handleResumeUpload(e.target.files[0])}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium cursor-pointer transition-all duration-200"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>

              {uploadedResume && (
                <div className="bg-blue-50 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                      {isResumeProcessing ? (
                        <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                      ) : (
                        <Sparkles className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">
                        {isResumeProcessing ? 'Processing Resume...' : 'Resume Uploaded'}
                      </p>
                      <p className="text-blue-700 text-sm">
                        {isResumeProcessing ? 'Extracting text from your resume...' : 'We\'ll analyze your experience for relevant questions'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Job Description */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Job Description</h3>
              </div>

              <div className="space-y-4">
                <label htmlFor="job-description" className="block text-sm font-semibold text-slate-900 mb-2">
                  Job Description
                </label>
                <textarea
                  id="job-description"
                  name="job-description"
                  onChange={handleJobDescChange}
                  placeholder="Paste the job description here...

Example:
Software Engineer - Frontend
We're looking for a skilled frontend developer with experience in React, TypeScript, and modern web technologies..."
                  className="w-full h-40 p-4 border border-slate-300 rounded-xl resize-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all duration-200 text-slate-900 bg-white"
                />
                
                {jobDescTextareaRef.current && (
                  <div className="bg-purple-50 rounded-2xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                        <Brain className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-purple-900">Ready for Analysis</p>
                        <p className="text-purple-700 text-sm">AI will match questions to job requirements</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Preferences */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Customize Session</h3>
              </div>

              {/* Question Count */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-900">Number of Questions</label>
                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                  <button
                    onClick={() => setQuestionCount(Math.max(1, questionCount - 1))}
                    className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-slate-600" />
                  </button>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{questionCount}</div>
                    <div className="text-xs text-slate-500">questions</div>
                  </div>
                  <button
                    onClick={() => setQuestionCount(Math.min(20, questionCount + 1))}
                    className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Question Types */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-900">Question Types</label>
                <div className="space-y-3">
                  {[
                    { 
                      key: 'technical', 
                      label: 'Technical', 
                      desc: 'Coding, algorithms, system design',
                      icon: <Code className="w-5 h-5" />,
                      color: 'from-blue-500 to-cyan-500'
                    },
                    { 
                      key: 'behavioral', 
                      label: 'Behavioral', 
                      desc: 'Leadership, teamwork, problem-solving',
                      icon: <MessageSquare className="w-5 h-5" />,
                      color: 'from-indigo-500 to-purple-500'
                    },
                    { 
                      key: 'domainSpecific', 
                      label: 'Role-Specific', 
                      desc: 'Industry and position focused',
                      icon: <Briefcase className="w-5 h-5" />,
                      color: 'from-purple-500 to-pink-500'
                    }
                  ].map((pref) => (
                    <label key={pref.key} className="cursor-pointer block">
                      <div className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${
                        selectedPreferences[pref.key]
                          ? 'border-blue-300 bg-blue-50 shadow-lg transform scale-105'
                          : 'border-slate-200 hover:border-blue-200 hover:bg-blue-50'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${pref.color} rounded-lg flex items-center justify-center text-white`}>
                            {pref.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-slate-900">{pref.label}</span>
                              {selectedPreferences[pref.key] && (
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <p className="text-sm text-slate-500">{pref.desc}</p>
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedPreferences[pref.key]}
                        onChange={() => togglePreference(pref.key)}
                        className="sr-only"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-900">Question Difficulty</h4>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: 'easy', label: 'Easy', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700' },
                    { key: 'medium', label: 'Medium', color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-700' },
                    { key: 'hard', label: 'Hard', color: 'from-red-500 to-pink-500', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-700' }
                  ].map((diff) => (
                    <div key={diff.key} className={`p-4 rounded-2xl border-2 ${diff.bgColor} ${diff.borderColor} transition-all duration-200 hover:shadow-lg`}>
                      <div className="text-center space-y-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${diff.color} rounded-xl flex items-center justify-center mx-auto`}>
                          <span className="text-white font-bold text-lg">
                            {difficultyPreferences[diff.key]}
                          </span>
                        </div>
                        <div>
                          <h5 className={`font-semibold ${diff.textColor}`}>{diff.label}</h5>
                          <p className="text-xs text-slate-500 mt-1">Questions</p>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setDifficultyPreferences(prev => ({
                              ...prev,
                              [diff.key]: Math.max(0, prev[diff.key] - 1)
                            }))}
                            className={`w-8 h-8 ${diff.bgColor} hover:bg-white rounded-lg flex items-center justify-center ${diff.textColor} font-bold transition-colors border border-current`}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => setDifficultyPreferences(prev => ({
                              ...prev,
                              [diff.key]: prev[diff.key] + 1
                            }))}
                            className={`w-8 h-8 ${diff.bgColor} hover:bg-white rounded-lg flex items-center justify-center ${diff.textColor} font-bold transition-colors border border-current`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
                  <div className="text-center space-y-3">
                    <p className="text-lg font-bold text-slate-900">
                      Total: {totalDifficultyQuestions} questions
                    </p>
                    <p className="text-sm text-slate-600">
                      {difficultyPreferences.easy > 0 && `${difficultyPreferences.easy} Easy`}
                      {difficultyPreferences.easy > 0 && difficultyPreferences.medium > 0 && ' • '}
                      {difficultyPreferences.medium > 0 && `${difficultyPreferences.medium} Medium`}
                      {difficultyPreferences.medium > 0 && difficultyPreferences.hard > 0 && ' • '}
                      {difficultyPreferences.hard > 0 && `${difficultyPreferences.hard} Hard`}
                    </p>
                    {totalDifficultyQuestions > 0 && (
                      <button
                        type="button"
                        onClick={() => setDifficultyPreferences({ easy: 0, medium: 0, hard: 0 })}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                      >
                        Reset to default
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={generateQuestions}
                disabled={!Object.values(selectedPreferences).some(Boolean) || isProcessing || showFullScreenLoader}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-base transition-all duration-300 ${
                  Object.values(selectedPreferences).some(Boolean) && !isProcessing && !showFullScreenLoader
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white transform hover:scale-105 shadow-xl hover:shadow-2xl'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Generating Questions...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate {totalDifficultyQuestions > 0 ? totalDifficultyQuestions : questionCount} Questions</span>
                    </>
                  )}
                </div>
              </button>

              {/* AI Enhancement Notice */}
              {(uploadedResume || jobDescTextareaRef.current) && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mt-1">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">AI Enhancement Active</p>
                      <div className="text-slate-700 text-sm space-y-1">
                        {uploadedResume && <p>✓ Resume analysis enabled</p>}
                        {jobDescTextareaRef.current && <p>✓ Job description matching enabled</p>}
                        <p className="text-blue-600 font-medium">Questions will be highly personalized</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <QuestionsDisplay
          generatedQuestions={generatedQuestions}
          mockQuestions={mockQuestions}
          questionCount={questionCount}
          recordingStates={recordingStates}
          recordingTimes={recordingTimes}
          audioUrls={audioUrls}
          expandedAnswers={expandedAnswers}
          expandedSampleAnswers={expandedSampleAnswers}
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
      )}
    </div>
  );
};

export default PracticePage; 