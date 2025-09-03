import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

const LoginPage = ({ 
  isSignUp,
  setIsSignUp,
  authError,
  authLoading,
  handleEmailChange,
  handlePasswordChange,
  handleAuthSubmit,
  setCurrentPage,
  handleGuestMode
}) => {
  // Use refs for form inputs to prevent them from resetting during testimonials rotation
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [googleSuccess, setGoogleSuccess] = useState('');

  // Dynamic testimonials generation - different for sign-in vs sign-up
  const generateTestimonials = useCallback((mode) => {
    const baseTestimonials = {
      signIn: [
        {
          name: "Sarah Johnson",
          role: "Software Engineer",
          company: "Google",
          text: "InterviewAI helped me land my dream job at Google. The personalized questions were spot-on and the AI feedback was incredibly valuable."
        },
        {
          name: "Michael Chen",
          role: "Product Manager",
          company: "Microsoft",
          text: "The practice sessions were so realistic. I felt confident going into my actual interviews and the progress tracking kept me motivated."
        },
        {
          name: "Emily Rodriguez",
          role: "Data Scientist",
          company: "Amazon",
          text: "Perfect for technical interviews. The resume-based questions were exactly what I needed and the difficulty levels were spot on."
        },
        {
          name: "David Kim",
          role: "Frontend Developer",
          company: "Meta",
          text: "The AI analysis of my answers was eye-opening. I improved significantly with each session and landed my dream role."
        },
        {
          name: "Alex Thompson",
          role: "DevOps Engineer",
          company: "Netflix",
          text: "Returning to InterviewAI after landing my job - the platform keeps evolving and the new features are amazing!"
        },
        {
          name: "Lisa Wang",
          role: "UX Designer",
          company: "Apple",
          text: "I love how InterviewAI remembers my progress. It's like having a personal interview coach that knows my strengths."
        }
      ],
      signUp: [
        {
          name: "James Wilson",
          role: "Full Stack Developer",
          company: "Spotify",
          text: "Just started using InterviewAI and I'm blown away by how quickly it adapts to my experience level and job preferences."
        },
        {
          name: "Maria Garcia",
          role: "Machine Learning Engineer",
          company: "Tesla",
          text: "The sign-up process was seamless and within minutes I was practicing with questions tailored to my ML background."
        },
        {
          name: "Ryan Park",
          role: "Mobile Developer",
          company: "Uber",
          text: "New to InterviewAI and already seeing improvement. The AI feedback is spot-on and the progress tracking is motivating."
        },
        {
          name: "Sophie Turner",
          role: "Product Designer",
          company: "Airbnb",
          text: "Started my interview prep journey here and the personalized approach is exactly what I needed to build confidence."
        },
        {
          name: "Carlos Mendez",
          role: "Backend Engineer",
          company: "Stripe",
          text: "Fresh perspective with InterviewAI - the platform understands modern tech interviews and adapts to current trends."
        },
        {
          name: "Nina Patel",
          role: "Data Engineer",
          company: "LinkedIn",
          text: "New user here and already impressed by the depth of questions and the intelligent difficulty progression."
        }
      ]
    };

    // Shuffle the testimonials for variety
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Return 4 random testimonials for the current mode
    return shuffleArray(baseTestimonials[mode]).slice(0, 4);
  }, []);

  // Memoize testimonials data to prevent unnecessary re-renders
  const testimonials = useMemo(() => {
    return generateTestimonials(isSignUp ? 'signUp' : 'signIn');
  }, [isSignUp, generateTestimonials]);

  // Form Component - Memoized to prevent re-renders
  const FormSection = useCallback(() => (
    <div className="w-full lg:w-2/5 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('welcome')}
          className="mb-8 flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back to Welcome</span>
        </button>

        {/* Auth Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-300">
              {isSignUp 
                ? 'Join InterviewAI to track your progress' 
                : 'Sign in to continue your interview prep'
              }
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue=""
                onChange={(e) => {
                  emailRef.current = e.target.value;
                  handleEmailChange(e);
                }}
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all [&::placeholder]:text-slate-400"
                placeholder="Enter your email"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                defaultValue=""
                onChange={(e) => {
                  passwordRef.current = e.target.value;
                  handlePasswordChange(e);
                }}
                required
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all [&::placeholder]:text-slate-400"
                placeholder="Enter your password"
                minLength={6}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              />
            </div>

            {authError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-300 text-sm">{authError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              {authLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                </div>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-300">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Toggling sign up mode:', !isSignUp);
                  setIsSignUp(!isSignUp);
                }}
                className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-8 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-slate-400 text-sm">or</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            aria-label="Sign in with Google"
            onClick={async () => {
              setGoogleLoading(true);
              setGoogleError('');
              try {
                const { data, error } = await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: window.location.origin
                  }
                });
                if (error) {
                  console.error('Google sign-in error:', error);
                  setGoogleError(error.message || 'Failed to sign in with Google');
                } else {
                  setGoogleSuccess('Redirecting to Google...');
                  // Clear success message after 3 seconds
                  setTimeout(() => setGoogleSuccess(''), 3000);
                }
              } catch (error) {
                console.error('Google sign-in error:', error);
                setGoogleError('An unexpected error occurred');
              } finally {
                setGoogleLoading(false);
              }
            }}
            disabled={googleLoading}
            className="w-full mt-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-xl border border-gray-300 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>{googleLoading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          {/* Google Sign-In Messages */}
          {googleError && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm text-center">{googleError}</p>
            </div>
          )}
          {googleSuccess && (
            <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm text-center">{googleSuccess}</p>
            </div>
          )}

          {/* Continue as Guest */}
          <button
            onClick={handleGuestMode}
            className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 transition-all duration-300"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  ), [isSignUp, authError, authLoading, googleLoading, googleError, googleSuccess, handleAuthSubmit, setCurrentPage, handleGuestMode, handleEmailChange, handlePasswordChange]);

  // Separate Testimonials Component with its own state
  const TestimonialsSection = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    // Reset testimonial index when mode changes
    useEffect(() => {
      setCurrentTestimonial(0);
    }, [isSignUp]);

    // Smooth testimonials rotation
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 4000); // Change every 4 seconds

      return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
      <div className="hidden lg:flex w-3/5 bg-white items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
              {isSignUp ? 'Join Our Community' : 'Success Stories'}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {isSignUp ? (
                <>Trusted by <span className="text-blue-600">Newcomers</span></>
              ) : (
                <>Trusted by <span className="text-blue-600">Thousands</span></>
              )}
            </h2>
            <p className="text-lg text-gray-600">
              {isSignUp 
                ? 'See how new users are transforming their interview skills' 
                : 'See how InterviewAI has helped candidates land their dream jobs'
              }
            </p>
          </div>

          {/* Animated Testimonials */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-50 p-8 border border-gray-200 min-h-[300px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 p-8 transition-all duration-1000 ease-in-out ${
                  index === currentTestimonial
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="text-center">
                  {/* Quote Icon */}
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-lg text-gray-700 leading-relaxed mb-8 italic">
                    "{testimonial.text}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-blue-600 text-sm font-medium">{testimonial.role}</p>
                      <p className="text-gray-500 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex">
      {/* Dynamic Layout: Testimonials on left for sign-in, on right for sign-up */}
      {isSignUp ? (
        <>
          <FormSection />
          <TestimonialsSection />
        </>
      ) : (
        <>
          <TestimonialsSection />
          <FormSection />
        </>
      )}
    </div>
  );
};

export default LoginPage; 