import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  Layers, 
  Factory, 
  Receipt, 
  Wallet, 
  Package,
  FileText,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import logoImg from '../../assets/Srinath Stone Company.png';

const menuGroups = [
  {
    title: 'MAIN MENU',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Customers', path: '/customers', icon: Users },
      { name: 'Vehicles', path: '/vehicles', icon: Truck },
    ]
  },
  {
    title: 'PLANT OPERATIONS',
    items: [
      { name: 'Materials', path: '/materials', icon: Layers },
      { name: 'Production', path: '/production', icon: Factory },
      { name: 'Stock', path: '/stock', icon: Package },
    ]
  },
  {
    title: 'ACCOUNTS & REPORTS',
    items: [
      { name: 'Billing', path: '/billing', icon: Receipt },
      { name: 'Expenses', path: '/expenses', icon: Wallet },
      { name: 'Reports', path: '/reports', icon: FileText },
    ]
  }
];

export default function Sidebar({ onLogout, isOpen, setIsOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#0f172a] text-slate-300 flex flex-col h-full shadow-2xl z-50 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-3 right-3 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg z-50 bg-slate-900/50 backdrop-blur-sm"
        >
          <X size={18} />
        </button>

        {/* Brand / Logo Area */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-12 h-12 flex-shrink-0">
          <img src={logoImg} alt="Srinath Stone Company Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wide text-white leading-tight">SRINATH STONE</h1>
          <p className="text-[11px] text-blue-400 font-medium tracking-widest uppercase mt-0.5">ERP System 1.0</p>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-6 px-4">
            <h3 className="text-xs font-semibold text-slate-500 tracking-wider mb-3 px-2">
              {group.title}
            </h3>
            <nav className="space-y-1.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen && setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? 'bg-blue-600/10 text-blue-500' 
                        : 'hover:bg-slate-800/50 hover:text-slate-100'
                    }`}
                  >
                    <Icon 
                      size={18} 
                      className={`transition-colors ${isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'}`} 
                    />
                    <span className={`font-medium text-sm ${isActive ? 'text-blue-500 font-semibold' : ''}`}>
                      {item.name}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Settings / Footer Area */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          to="/settings"
          onClick={() => setIsOpen && setIsOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
            location.pathname === '/settings'
              ? 'bg-blue-600/10 text-blue-500' 
              : 'hover:bg-slate-800/50 hover:text-slate-100'
          }`}
        >
          <Settings size={18} className={location.pathname === '/settings' ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'} />
          <span className="font-medium text-sm">Settings</span>
        </Link>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group hover:bg-red-500/10 text-slate-400 hover:text-red-500"
        >
          <LogOut size={18} className="text-slate-500 group-hover:text-red-500" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
    </>
  );
}
