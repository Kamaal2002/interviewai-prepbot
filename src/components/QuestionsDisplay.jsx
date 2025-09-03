import React from 'react';
import { 
  CheckCircle2, Plus, Eye, MessageSquare, Mic, Square, 
  Play, X, ChevronDown, Sparkles 
} from 'lucide-react';

const QuestionsDisplay = ({
  generatedQuestions,
  mockQuestions,
  questionCount,
  recordingStates,
  recordingTimes,
  audioUrls,
  expandedAnswers,
  expandedSampleAnswers,
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
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white rounded-3xl p-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Your Practice Questions</h3>
            <p className="text-slate-600">Generated {generatedQuestions.length > 0 ? generatedQuestions.length : mockQuestions.length} personalized questions</p>
          </div>
        </div>
        <button
          onClick={() => setQuestionsGenerated(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Session</span>
        </button>
      </div>

      <div className="grid gap-6 pb-6">
        {(generatedQuestions.length > 0 ? generatedQuestions : mockQuestions).slice(0, questionCount).map((question, index) => (
          <div key={question.id} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {getTypeIcon(question.type)}
                      <span>{question.type}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      question.difficulty === 'Easy' ? 'text-emerald-600 bg-emerald-50' :
                      question.difficulty === 'Medium' ? 'text-amber-600 bg-amber-50' :
                      'text-red-600 bg-red-50'
                    }`}>
                      {question.difficulty}
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="text-xl font-semibold text-slate-900 leading-relaxed">
                {question.text}
              </h4>

              {recordingStates[question.id] && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-5 h-5 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-5 h-5 bg-red-400 rounded-full animate-ping"></div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-red-900 text-lg">Recording Your Answer</h5>
                      <p className="text-red-700 text-sm mt-1">Duration: {formatTime(recordingTimes[question.id] || 0)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleAnswer(question.id)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{expandedAnswers[question.id] ? 'Hide Guide' : 'View Guide'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      expandedAnswers[question.id] ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  <button
                    onClick={() => toggleSampleAnswer(question.id)}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{expandedSampleAnswers[question.id] ? 'Hide Sample' : 'View Sample'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      expandedSampleAnswers[question.id] ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {!recordingStates[question.id] && !audioUrls[question.id] ? (
                    <button
                      onClick={() => startRecording(question.id)}
                      disabled={Object.values(recordingStates).some(Boolean)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        Object.values(recordingStates).some(Boolean)
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      <span>Record Your Answer</span>
                    </button>
                  ) : recordingStates[question.id] ? (
                    <button
                      onClick={() => stopRecording(question.id)}
                      className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                    >
                      <Square className="w-4 h-4" />
                      <span>Stop Recording ({formatTime(recordingTimes[question.id] || 0)})</span>
                    </button>
                  ) : null}
                </div>

                {audioUrls[question.id] && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200 w-full max-w-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Play className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-green-900 text-lg">Your Practice Answer</h5>
                        <p className="text-green-700 text-sm mt-1">Duration: {formatTime(recordingTimes[question.id] || 0)}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-sm mb-3">
                      <audio 
                        controls 
                        className="w-full h-12"
                        style={{
                          '--plyr-color-main': '#059669',
                          '--plyr-audio-controls-background': '#f0fdf4',
                          '--plyr-audio-control-color': '#059669'
                        }}
                      >
                        <source src={audioUrls[question.id]} type="audio/webm" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => clearRecording(question.id)}
                        className="flex items-center space-x-2 bg-white hover:bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 border border-red-200"
                      >
                        <X className="w-4 h-4" />
                        <span className="text-sm">Delete</span>
                      </button>
                      <button
                        onClick={() => {
                          clearRecording(question.id);
                          startRecording(question.id);
                        }}
                        disabled={Object.values(recordingStates).some(Boolean)}
                        className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm ${
                          Object.values(recordingStates).some(Boolean)
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                        <span>Practice Again</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {expandedAnswers[question.id] && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 transform transition-all duration-300">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-blue-900 mb-2">AI-Generated Answer Guide</h5>
                      <p className="text-blue-800 leading-relaxed">{question.answerGuide || question.answer}</p>
                    </div>
                  </div>
                </div>
              )}

              {expandedSampleAnswers[question.id] && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 transform transition-all duration-300">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-green-900 mb-2">Complete Sample Answer</h5>
                      <p className="text-green-800 leading-relaxed">{question.sampleAnswer || 'Sample answer not available yet.'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsDisplay; 