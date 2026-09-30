import { Suspense, useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  LogOut,
  Layers,
  Search,
  Settings,
  User as UserIcon
} from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationsDropdown } from '../features/account/components/NotificationsDropdown';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Invoices', href: '/invoices', icon: FileText },
];

export const DashboardLayout = () => {
  const logout = useAuthStore((state) => state.logout);
  const email = useAuthStore((state) => state.email);
  const companyId = useAuthStore((state) => state.companyId);
  const navigate = useNavigate();
  const location = useLocation();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsProfileOpen(false);
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentNav = location.pathname === '/profile' ? 'Profile' : location.pathname === '/settings' ? 'Settings' : navigation.find(n => location.pathname === n.href || (n.href !== '/' && location.pathname.startsWith(n.href)))?.name || 'Dashboard';

  const filteredRoutes = navigation.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="relative min-h-screen flex bg-[#030303] overflow-hidden text-white selection:bg-indigo-500/30">
      {/* Subtle Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] mix-blend-overlay"></div>
      </div>
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex md:w-[280px] md:flex-col md:fixed md:inset-y-0 bg-black/40 backdrop-blur-xl border-r border-white/[0.05] z-20"
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo Area */}
          <div className="flex items-center h-[72px] flex-shrink-0 px-6 space-x-3 mb-2 mt-2">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <Layers className="h-6 w-6 text-indigo-400" />
            </div>
            <span className="text-[22px] font-bold tracking-tight text-white">BizFlow</span>
          </div>

          {/* Current Workspace Display */}
          <div className="px-5 mb-8 mt-2">
            <div className="w-full flex items-center justify-between px-4 h-[52px] bg-white/[0.02] border border-white/[0.05] rounded-[14px]">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-[14px] font-bold shrink-0">
                  W
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-medium text-slate-300 truncate">Current Workspace</span>
                  {companyId && (
                    <span className="text-[11px] text-slate-500 truncate font-mono mt-0.5">
                      ID: {companyId.substring(0, 8)}...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-5 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className="relative group flex items-center px-4 min-h-[48px] text-[15.5px] font-medium rounded-[14px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-indigo-500/10 rounded-[14px] border border-indigo-500/20"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <item.icon 
                      className={cn(
                        "mr-4 flex-shrink-0 h-[22px] w-[22px] relative z-10 transition-colors",
                        isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-300"
                      )} 
                    />
                    <span className={cn(
                      "relative z-10 transition-colors",
                      isActive ? "text-indigo-300 font-medium" : "text-slate-400 group-hover:text-slate-200"
                    )}>
                      {item.name}
                    </span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
          
          {/* User / Logout */}
          <div className="flex-shrink-0 p-5 mb-2 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 min-h-[48px] text-[15.5px] font-medium text-slate-400 rounded-[14px] hover:bg-white/[0.05] hover:text-slate-200 transition-colors group focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <LogOut className="mr-4 h-[22px] w-[22px] text-slate-400 group-hover:text-slate-300" />
              Sign out
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="md:pl-[280px] flex flex-col flex-1 w-full relative min-h-screen">
        {/* Top Navbar */}
        <motion.header 
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="sticky top-0 z-10 flex-shrink-0 h-[72px] bg-transparent border-b border-white/[0.05] flex items-center justify-between px-8 backdrop-blur-md"
        >
          {/* Breadcrumb / Title */}
          <div className="flex items-center">
            <h1 className="text-[24px] font-semibold tracking-tight text-white">
              {currentNav}
            </h1>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => { setIsSearchOpen(true); setSearchQuery(''); }}
              className="hidden lg:flex items-center justify-between px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-base text-slate-400 w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors hover:bg-white/[0.05]"
            >
              <div className="flex items-center">
                <Search className="h-5 w-5 mr-3 opacity-60" />
                <span className="opacity-80 font-light">Search or jump to...</span>
              </div>
              <span className="text-sm bg-white/[0.05] text-slate-300 px-2 py-0.5 rounded-md border border-white/[0.1] font-mono">⌘K</span>
            </button>
            
            <NotificationsDropdown />
            
            <div className="relative ml-2" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
                aria-label="User profile"
                className="h-11 w-11 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-base shadow-[0_0_15px_rgba(99,102,241,0.3)] ring-2 ring-white/[0.1] focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:scale-105 transition-transform"
              >
                {email ? email.charAt(0).toUpperCase() : 'U'}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-60 origin-top-right rounded-2xl bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden focus:outline-none z-50"
                  >
                    <div className="px-4 py-3 border-b border-white/[0.08]">
                      <p className="text-sm font-medium text-white truncate">Logged in as</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{email || 'Unknown User'}</p>
                    </div>
                    <div className="py-1">
                      <button 
                        onClick={() => { setIsProfileOpen(false); navigate('/profile'); }}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                      >
                        <UserIcon className="mr-3 h-4 w-4 text-slate-400" />
                        Profile
                      </button>
                      <button 
                        onClick={() => { setIsProfileOpen(false); navigate('/settings'); }}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                      >
                        <Settings className="mr-3 h-4 w-4 text-slate-400" />
                        Settings
                      </button>
                    </div>
                    <div className="border-t border-white/[0.08] py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="mr-3 h-4 w-4 text-rose-400" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>

        {/* Search Modal */}
        <AnimatePresence>
          {isSearchOpen && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 sm:pt-32">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={() => setIsSearchOpen(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="relative w-full max-w-xl mx-4 transform overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/[0.1] shadow-2xl"
              >
                <div className="flex items-center border-b border-white/[0.08] px-4">
                  <Search className="h-5 w-5 text-slate-400 shrink-0" />
                  <input
                    autoFocus
                    className="h-14 w-full bg-transparent px-4 text-white placeholder-slate-500 focus:outline-none text-base"
                    placeholder="Search for customers, products, or invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="text-[10px] font-medium text-slate-400 bg-white/[0.05] border border-white/[0.1] px-2 py-1 rounded hover:bg-white/[0.1] transition-colors"
                  >
                    ESC
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto py-2">
                  {filteredRoutes.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                      No results found for "{searchQuery}".
                    </div>
                  ) : (
                    filteredRoutes.map((route) => (
                      <button
                        key={route.href}
                        className="w-full text-left px-4 py-3 hover:bg-indigo-500/10 focus:bg-indigo-500/10 focus:outline-none flex items-center text-sm text-slate-300 transition-colors group"
                        onClick={() => {
                          navigate(route.href);
                          setIsSearchOpen(false);
                        }}
                      >
                        <route.icon className="h-4 w-4 mr-3 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                        <span className="group-hover:text-white transition-colors">{route.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Page Content with Route Transitions */}
        <main className="flex-1 focus:outline-none overflow-x-hidden relative">
          <div className="p-8 pb-20 max-w-[1600px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Suspense fallback={
                  <div className="flex items-center justify-center h-[50vh]">
                    <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                  </div>
                }>
                  <Outlet />
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
