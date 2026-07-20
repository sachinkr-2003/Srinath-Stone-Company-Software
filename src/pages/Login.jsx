import { useState } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';
import logoImg from '../assets/Srinath Stone Company.png';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network request for premium feel
    setTimeout(() => {
      setIsLoading(false);
      if (username === 'admin' && password === 'admin123') {
        onLogin();
      } else {
        Swal.fire({
          title: 'Access Denied',
          text: 'The credentials you entered are incorrect. Try admin / admin123',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          customClass: { popup: 'rounded-2xl font-sans' }
        });
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 w-full h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-[#f8fafc] overflow-hidden selection:bg-blue-500 selection:text-white">
      
      {/* Premium Background Orbs (Animated) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-tr from-blue-400 to-emerald-300 opacity-20 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-bl from-indigo-500 to-purple-400 opacity-20 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }}></div>

      {/* Main Login Container */}
      <div className="w-full max-w-[440px] flex flex-col relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        
        {/* The Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-white p-6 sm:p-10">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 p-3">
              <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base font-medium">
              Log in to Srinath Stone ERP
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 px-1 block">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110 group-focus-within:text-blue-600 text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 px-1 block">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110 group-focus-within:text-blue-600 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full relative group overflow-hidden rounded-2xl bg-slate-900 text-white font-semibold text-[15px] py-4 transition-transform active:scale-[0.98]"
              >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    Sign in to ERP
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
            </div>
          </form>

        </div>
        
        {/* Footer info */}
        <p className="text-center text-slate-400 text-xs sm:text-sm mt-6 font-medium shrink-0">
          Secure, offline management system <br className="sm:hidden" />© 2026 Srinath Stone Co.
        </p>
      </div>

    </div>
  );
}
