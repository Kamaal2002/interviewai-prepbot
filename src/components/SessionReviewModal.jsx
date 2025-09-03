import React from 'react';
import { X } from 'lucide-react';

const SessionReviewModal = ({
  showSessionModal,
  selectedSession,
  setShowSessionModal,
  setActiveTab
}) => {
  if (!showSessionModal || !selectedSession) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-slate-900">{selectedSession.title || 'Practice Session Review'}</h2>
            <button 
              onClick={() => setShowSessionModal(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Session Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date:</span>
                    <span className="font-medium">{new Date(selectedSession.created_at || selectedSession.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Questions:</span>
                    <span className="font-medium">{selectedSession.question_count || selectedSession.questions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Difficulty:</span>
                    <span className="font-medium">{selectedSession.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Score:</span>
                    <span className="font-medium">{selectedSession.score}%</span>
                  </div>
                </div>
              </div>
              
              {selectedSession.resume_text && (
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Resume Used</h3>
                  <div className="max-h-48 overflow-y-auto">
                    <pre className="text-slate-700 text-sm whitespace-pre-wrap font-sans">{selectedSession.resume_text}</pre>
                  </div>
                </div>
              )}
              
              {selectedSession.job_description_text && (
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Job Description</h3>
                  <div className="max-h-48 overflow-y-auto">
                    <pre className="text-slate-700 text-sm whitespace-pre-wrap font-sans">{selectedSession.job_description_text}</pre>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Questions & Answers</h3>
                {selectedSession.questions && Array.isArray(selectedSession.questions) ? (
                  <div className="space-y-6 max-h-96 overflow-y-auto">
                    {selectedSession.questions.map((question, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-slate-900 mb-3">Question {index + 1}</h4>
                        <p className="text-slate-700 text-sm mb-3 leading-relaxed">{question.text}</p>
                        {question.answerGuide && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-600 font-medium mb-2">Answer Guide:</p>
                            <p className="text-slate-700 text-sm leading-relaxed">{question.answerGuide}</p>
                          </div>
                        )}
                        {question.sampleAnswer && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-green-600 font-medium mb-2">Sample Answer:</p>
                            <p className="text-slate-700 text-sm leading-relaxed">{question.sampleAnswer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No questions available for this session.</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button 
              onClick={() => setShowSessionModal(false)}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            <button 
              onClick={() => {
                setShowSessionModal(false);
                setActiveTab('practice');
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            >
              Practice Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionReviewModal; 