import { Bell, Search, User, Menu } from 'lucide-react';
import { Input } from '../ui/Input';

export default function Header({ onMenuClick }) {
  const today = new Date();
  const dateString = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-8 z-10 sticky top-0">
      <div className="flex items-center gap-4 sm:gap-8 flex-1">
        
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="hidden sm:block text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
          📅 {dateString}
        </div>
        
        <div className="relative w-full max-w-sm hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Quick search anywhere..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-6">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-6 cursor-pointer group">
          <div className="h-9 w-9 bg-blue-50 border border-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold shadow-sm group-hover:shadow-md transition-all">
            <User size={18} />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold text-slate-800 leading-tight">Admin User</span>
            <span className="text-[11px] font-medium text-slate-500">Plant Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
}
