import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, Shield, Clock, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/services/auth.api';

const features = [
  { icon: Clock, text: 'Schedule thousands of emails with precise timing' },
  { icon: BarChart3, text: 'Real-time delivery monitoring and analytics' },
  { icon: Shield, text: 'Built-in rate limiting and compliance controls' },
];

export default function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true });
  }, [user, loading, navigate]);

  // Show nothing while checking auth to avoid flash
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-5 h-5 border-2 border-[#4f46e5] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] bg-[#0a0a0a] px-14 py-12 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-[#4f46e5] rounded-full opacity-[0.06] blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#4f46e5] flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-white font-semibold text-base tracking-tight">ReachInbox</span>
          </div>
        </div>

        <div className="relative flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-semibold text-white leading-tight tracking-tight">
              Reach the right people.<br />
              <span className="text-[#818cf8]">At the right time.</span>
            </h1>
            <p className="text-[#737373] text-base mt-4 leading-relaxed max-w-sm">
              Automate personalized outreach with reliable email scheduling built for modern teams.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center shrink-0">
                  <Icon size={12} className="text-[#818cf8]" />
                </div>
                <span className="text-sm text-[#737373]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-xs text-[#404040]">
            Trusted by growth teams at modern companies.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-[#fafafa]">
        <div className="w-full max-w-[360px] flex flex-col gap-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-6 h-6 rounded-md bg-[#4f46e5] flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="font-semibold text-[#0a0a0a]">ReachInbox</span>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#0a0a0a] tracking-tight">Welcome back</h2>
            <p className="text-sm text-[#737373] mt-1">Sign in to continue to ReachInbox</p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={authApi.googleLoginUrl()}
              className="flex items-center justify-center gap-3 h-10 px-4 bg-white border border-[#e5e5e5] rounded-lg text-sm font-medium text-[#0a0a0a] hover:bg-[#f5f5f5] hover:border-[#d4d4d4] transition-all duration-150 shadow-sm group"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
              <ArrowRight size={13} className="ml-auto text-[#a3a3a3] group-hover:text-[#525252] transition-colors" />
            </a>
          </div>

          <p className="text-xs text-[#a3a3a3] text-center leading-relaxed">
            By continuing, you agree to our{' '}
            <a href="#" className="text-[#525252] hover:text-[#0a0a0a] underline underline-offset-2">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[#525252] hover:text-[#0a0a0a] underline underline-offset-2">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
