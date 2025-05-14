import React, { useEffect } from 'react';
import { 
  Clock, Target, BookOpen, TrendingUp, Calendar, 
  Star, ChevronRight, Zap, X 
} from 'lucide-react';

const HistoryPage = ({
  isLoggedIn,
  sessionsLoaded,
  userSessions,
  sessionsLoading,
  loadUserSessions,
  handleReviewSession,
  setActiveTab
}) => {
  // Load sessions only once when component mounts and user is logged in
  useEffect(() => {
    console.log('HistoryPage: useEffect triggered, isLoggedIn:', isLoggedIn);
    if (isLoggedIn && !sessionsLoaded) {
      loadUserSessions();
    }
  }, [isLoggedIn, sessionsLoaded, loadUserSessions]);

  // Use real user sessions only
  const sessions = userSessions;
  
  console.log('HistoryPage: userSessions length:', userSessions.length);
  console.log('HistoryPage: sessions being used:', sessions);
  console.log('HistoryPage: sessionsLoading:', sessionsLoading);
  
  // Calculate stats only when not loading and have real data
  const totalQuestions = sessionsLoading ? 0 : sessions.reduce((sum, session) => sum + (session.question_count || session.questions || 0), 0);
  const totalSessions = sessionsLoading ? 0 : sessions.length;
  const averageScore = sessionsLoading || sessions.length === 0 ? 0 : Math.round(sessions.reduce((sum, session) => sum + (session.score || 0), 0) / sessions.length);
  const lastSessionDate = sessionsLoading || sessions.length === 0 ? null : new Date(sessions[0]?.created_at || sessions[0]?.date).toLocaleDateString();
  
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
          <Clock className="w-4 h-4" />
          <span>Practice History</span>
        </div>
        <h2 className="text-4xl font-bold text-slate-900">Track Your Progress</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Review your past sessions, analyze performance trends, and identify areas for improvement
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Total Sessions', value: totalSessions, icon: <Target className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
          { label: 'Questions Practiced', value: totalQuestions, icon: <BookOpen className="w-5 h-5" />, color: 'from-indigo-500 to-purple-500' },
          { label: 'Average Score', value: averageScore + '%', icon: <TrendingUp className="w-5 h-5" />, color: 'from-emerald-500 to-green-500' },
          { label: 'Last Session', value: lastSessionDate || 'None', icon: <Calendar className="w-5 h-5" />, color: 'from-amber-500 to-orange-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Session History */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900">Recent Sessions</h3>
        
        {sessionsLoading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-slate-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Loading your sessions...</span>
            </div>
          </div>
        )}
        

        
        {!sessionsLoading && sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white font-bold text-lg">{session.score}</div>
                        <div className="text-blue-200 text-xs">SCORE</div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-xl font-semibold text-slate-900">{session.title || 'Practice Session'}</h4>
                      <div className="flex items-center space-x-4 text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{session.duration}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{session.question_count || session.questions} questions</span>
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          session.difficulty === 'Easy' ? 'text-emerald-600 bg-emerald-50' :
                          session.difficulty === 'Medium' ? 'text-amber-600 bg-amber-50' :
                          session.difficulty === 'Hard' ? 'text-red-600 bg-red-50' :
                          'text-blue-600 bg-blue-50'
                        }`}>
                          {session.difficulty}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{new Date(session.created_at || session.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                        session.score >= 90 ? 'text-emerald-600 bg-emerald-50' :
                        session.score >= 75 ? 'text-blue-600 bg-blue-50' :
                        session.score >= 60 ? 'text-amber-600 bg-amber-50' :
                        'text-red-600 bg-red-50'
                      }`}>
                        <Star className="w-4 h-4" />
                        <span>
                          {session.score >= 90 ? 'Excellent' :
                           session.score >= 75 ? 'Good' :
                           session.score >= 60 ? 'Fair' : 'Needs Work'}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleReviewSession(session)}
                      className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium transition-all duration-200 group-hover:bg-blue-100 group-hover:text-blue-700"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!sessionsLoading && sessions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No practice sessions yet</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Start your first practice session to track your progress and improve your interview skills
            </p>
            <button
              onClick={() => setActiveTab('practice')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Start First Session</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage; 