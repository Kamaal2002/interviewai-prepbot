import React from 'react';
import { ArrowRight, Sparkles, Brain, Code, MessageSquare, Briefcase, Target, Clock, TrendingUp, Award, Upload, CheckCircle, Users, Star, Globe, Shield, BarChart3, FileText, Smartphone, User, Building, Cpu, Mic } from 'lucide-react';

const WelcomePage = ({ setCurrentPage, handleGuestMode }) => {
  return (
    <div className="min-h-screen bg-white relative overflow-y-auto">
      {/* Hero Section - Clean Modern Design */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-50 rounded-full opacity-60"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-cyan-50 rounded-full opacity-40"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-50 rounded-full opacity-50"></div>
        </div>

        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-20 items-center relative z-10">

          {/* Left Column - Main Content */}
          <div className="space-y-12 text-center lg:text-left">
            <div className="space-y-10">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full px-6 py-3 border border-blue-200 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-blue-700 font-semibold">AI-Powered Interview Coach</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-black text-gray-900 leading-tight">
                Master Your
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Next Interview
                </span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Get personalized questions, AI-powered feedback, and track your progress.
                Upload your resume for tailored practice sessions that match your experience.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => setCurrentPage('login')}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105"
              >
                <div className="flex items-center justify-center space-x-3">
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              <button
                onClick={handleGuestMode}
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-sm"
              >
                Continue as Guest
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { value: "10K+", label: "Questions Generated", icon: <Target className="w-5 h-5" /> },
                { value: "95%", label: "Success Rate", icon: <TrendingUp className="w-5 h-5" /> },
                { value: "500+", label: "Companies Covered", icon: <Award className="w-5 h-5" /> }
              ].map((stat, index) => (
                <div key={index} className="text-center space-y-3 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="flex items-center justify-center text-blue-500 mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6">
            <div className="grid gap-6">
              {[
                {
                  icon: <Brain className="w-6 h-6" />,
                  title: "AI-Powered Analysis",
                  desc: "Get intelligent feedback on your answers with advanced language processing",
                  color: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                },
                {
                  icon: <Upload className="w-6 h-6" />,
                  title: "Resume-Based Questions",
                  desc: "Upload your resume for personalized questions tailored to your experience",
                  color: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200"
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "Role-Specific Practice",
                  desc: "Questions designed specifically for your target position and company",
                  color: "bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`${feature.color} rounded-2xl p-6 border-2 hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <div className="text-blue-600">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section - Clean Two-Column Design */}
      <div className="relative z-10 py-20 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium shadow-sm border border-gray-200">
                How it works?
              </div>

              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Here's how it all comes <span className="text-blue-600">Together</span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                A high-performing AI-powered interview preparation system to practice and master your interview skills effortlessly.
              </p>

              {/* Background Pattern */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-60"></div>
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-40"></div>
              </div>
            </div>

            {/* Right Column - Steps */}
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Upload Resume & Details",
                  desc: "Start by uploading your resume and submitting key professional details securely for personalized analysis.",
                  icon: <User className="w-6 h-6" />,
                  color: "bg-blue-100"
                },
                {
                  step: "2",
                  title: "Add Job Description",
                  desc: "Paste the job description you're applying for to enable AI-powered matching and relevant question generation.",
                  icon: <Building className="w-6 h-6" />,
                  color: "bg-indigo-100"
                },
                {
                  step: "3",
                  title: "AI Generates Questions",
                  desc: "Our AI reviews your profile and job requirements, then carefully builds personalized interview questions.",
                  icon: <Cpu className="w-6 h-6" />,
                  color: "bg-purple-100"
                },
                {
                  step: "4",
                  title: "Practice & Improve",
                  desc: "Practice with our AI-powered feedback system, record answers, and track your progress for continuous improvement.",
                  icon: <Mic className="w-6 h-6" />,
                  color: "bg-cyan-100"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-5 group">
                  <div className={`flex-shrink-0 w-14 h-14 ${item.color} rounded-full border-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <div className="text-blue-600 font-bold text-lg">{item.step}</div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                        <div className="text-blue-600">
                          {item.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section - Redesigned */}
      <div className="relative z-10 py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-6">
              Why Choose Us?
            </div>

            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Why Choose Our <span className="text-blue-600">Platform</span>?
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              A high-performing AI-powered interview preparation system designed for your success with cutting-edge technology and personalized learning paths.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: "AI-Powered Analysis",
                desc: "Advanced AI reviews your answers for accuracy, with expert validation of key responses before feedback.",
                color: "bg-white border-gray-200"
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: "Fast Learning Paths",
                desc: "We combine smart algorithms and expert guidance to speed up your interview preparation.",
                color: "bg-white border-gray-200"
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Progress Tracking",
                desc: "Stay updated with real-time analytics, backed by detailed performance insights.",
                color: "bg-blue-600 border-blue-600 text-white"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure Practice Sessions",
                desc: "Your data is protected with enterprise-grade security and privacy controls.",
                color: "bg-white border-gray-200"
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Mobile-First Design",
                desc: "Practice anywhere with our responsive design that works perfectly on all devices.",
                color: "bg-white border-gray-200"
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Comprehensive Coverage",
                desc: "Questions and insights from top companies worldwide, including FAANG and startups.",
                color: "bg-white border-gray-200"
              }
            ].map((feature, index) => (
              <div key={index} className={`p-6 ${feature.color} rounded-2xl border-2 hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                <div className="flex flex-col items-start space-y-4">
                  <div className={`w-12 h-12 ${feature.color === 'bg-blue-600 border-blue-600 text-white' ? 'bg-white' : 'bg-blue-50'} rounded-xl flex items-center justify-center shadow-sm`}>
                    <div className={feature.color === 'bg-blue-600 border-blue-600 text-white' ? 'text-blue-600' : 'text-blue-600'}>
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold mb-3 ${feature.color === 'bg-blue-600 border-blue-600 text-white' ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </h3>
                    <p className={`leading-relaxed ${feature.color === 'bg-blue-600 border-blue-600 text-white' ? 'text-blue-100' : 'text-gray-600'}`}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Updated Blue Shade */}
      <div className="relative z-10 py-20 px-8 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Ace Your Next Interview?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of job seekers who have improved their interview skills with our AI-powered platform.
            Start your journey to interview success today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('login')}
              className="group relative px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl transform hover:scale-105"
            >
              <div className="flex items-center justify-center space-x-3">
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <button
              onClick={handleGuestMode}
              className="px-8 py-4 bg-transparent text-white font-semibold rounded-2xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Try as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 