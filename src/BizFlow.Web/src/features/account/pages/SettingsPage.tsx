import { useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { Settings as SettingsIcon, Bell, Shield, Moon, Monitor, Sun, Building2, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { accountService } from '../../../services/accountService';

export const SettingsPage = () => {
  const { companyId } = useAuthStore((state) => state);
  
  const { data: profile } = useQuery({
    queryKey: ['accountProfile'],
    queryFn: accountService.getCurrentProfile,
  });

  // Local preferences state (UI only)
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState({
    invoices: true,
    lowStock: true,
    business: false
  });

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-[32px] font-bold text-white tracking-tight">Settings</h1>
        <p className="text-[16px] text-slate-400 mt-1">Manage your workspace and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Vertical Navigation for Settings */}
        <div className="md:col-span-1 space-y-1 relative">
          <div className="sticky top-28 space-y-2">
            <a href="#general" className="flex items-center px-4 py-3 text-[15px] font-medium rounded-xl text-white bg-white/[0.05] border border-white/[0.08]">
              <SettingsIcon className="h-5 w-5 mr-3 text-indigo-400" />
              General
            </a>
            <a href="#appearance" className="flex items-center px-4 py-3 text-[15px] font-medium rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors">
              <Monitor className="h-5 w-5 mr-3" />
              Appearance
            </a>
            <a href="#notifications" className="flex items-center px-4 py-3 text-[15px] font-medium rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors">
              <Bell className="h-5 w-5 mr-3" />
              Notifications
            </a>
            <a href="#company" className="flex items-center px-4 py-3 text-[15px] font-medium rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors">
              <Building2 className="h-5 w-5 mr-3" />
              Workspace
            </a>
            <a href="#security" className="flex items-center px-4 py-3 text-[15px] font-medium rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors">
              <Shield className="h-5 w-5 mr-3" />
              Security
            </a>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="md:col-span-3 space-y-8">
          
          {/* General Section */}
          <section id="general" className="premium-card p-8">
            <h2 className="text-[20px] font-semibold text-white mb-6 border-b border-white/[0.08] pb-4">General Preferences</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[15px] font-medium text-slate-300 mb-2">Timezone</label>
                <select disabled className="w-full h-12 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-[15px] text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 appearance-none">
                  <option>UTC (Coordinated Universal Time)</option>
                </select>
                <p className="mt-2 text-sm text-slate-500">Currently fixed to UTC for this workspace.</p>
              </div>
              <div>
                <label className="block text-[15px] font-medium text-slate-300 mb-2">Language</label>
                <select disabled className="w-full h-12 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-[15px] text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 appearance-none">
                  <option>English (US)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section id="appearance" className="premium-card p-8">
            <h2 className="text-[20px] font-semibold text-white mb-6 border-b border-white/[0.08] pb-4">Appearance</h2>
            <div className="space-y-4">
              <p className="text-[15px] text-slate-400">Select the UI theme for BizFlow. Dark mode is currently the optimized default.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <button 
                  onClick={() => setTheme('dark')}
                  className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]'}`}
                >
                  <Moon className={`h-8 w-8 mb-3 ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className={`text-[15px] font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-400'}`}>Dark Theme</span>
                  {theme === 'dark' && <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-indigo-500" />}
                </button>
                <button 
                  disabled
                  className="relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-white/[0.04] bg-white/[0.01] opacity-50 cursor-not-allowed"
                >
                  <Sun className="h-8 w-8 mb-3 text-slate-600" />
                  <span className="text-[15px] font-medium text-slate-500">Light Theme</span>
                  <span className="absolute bottom-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold">Coming Soon</span>
                </button>
                <button 
                  disabled
                  className="relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-white/[0.04] bg-white/[0.01] opacity-50 cursor-not-allowed"
                >
                  <Monitor className="h-8 w-8 mb-3 text-slate-600" />
                  <span className="text-[15px] font-medium text-slate-500">System</span>
                </button>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section id="notifications" className="premium-card p-8">
            <h2 className="text-[20px] font-semibold text-white mb-6 border-b border-white/[0.08] pb-4">Notifications</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[16px] font-medium text-white">Invoice Updates</h4>
                  <p className="text-[14px] text-slate-400 mt-1">Receive alerts when invoices are created, paid, or cancelled.</p>
                </div>
                <button 
                  onClick={() => handleNotificationToggle('invoices')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] ${notifications.invoices ? 'bg-indigo-500' : 'bg-slate-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.invoices ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[16px] font-medium text-white">Low Stock Alerts</h4>
                  <p className="text-[14px] text-slate-400 mt-1">Get notified when a product falls below its minimum stock level.</p>
                </div>
                <button 
                  onClick={() => handleNotificationToggle('lowStock')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] ${notifications.lowStock ? 'bg-indigo-500' : 'bg-slate-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.lowStock ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[16px] font-medium text-white">Business Announcements</h4>
                  <p className="text-[14px] text-slate-400 mt-1">Receive updates about platform maintenance and new features.</p>
                </div>
                <button 
                  onClick={() => handleNotificationToggle('business')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] ${notifications.business ? 'bg-indigo-500' : 'bg-slate-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.business ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <p className="text-sm text-slate-500 italic pt-4">These preferences are currently saved locally for your session.</p>
            </div>
          </section>

          {/* Company Workspace */}
          <section id="company" className="premium-card p-8">
            <h2 className="text-[20px] font-semibold text-white mb-6 border-b border-white/[0.08] pb-4">Workspace Information</h2>
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 bg-slate-800 rounded-xl flex items-center justify-center text-2xl font-bold border border-white/[0.1]">
                  <Building2 className="h-8 w-8 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold text-white">Primary Workspace</h3>
                  <p className="text-[14px] text-slate-400 mt-1">Managed by BizFlow</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Company / Tenant ID</label>
                  <div className="flex items-center justify-between bg-black/40 border border-white/[0.05] p-3 rounded-xl">
                    <code className="text-sm text-slate-300 break-all">{profile?.companyId || companyId || 'Unavailable'}</code>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Security */}
          <section id="security" className="premium-card p-8 border-t-4 border-t-rose-500">
            <h2 className="text-[20px] font-semibold text-white mb-6 border-b border-white/[0.08] pb-4 flex items-center">
              <Shield className="h-5 w-5 mr-3 text-rose-400" />
              Security Details
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="text-[16px] font-medium text-white mb-2">Two-Factor Authentication</h4>
                <p className="text-[14px] text-slate-400 mb-4">Add an extra layer of security to your account. Not currently enabled by your administrator.</p>
                <button disabled className="px-5 py-2.5 text-[14px] font-medium rounded-xl text-slate-400 bg-white/[0.03] border border-white/[0.08] opacity-70 cursor-not-allowed">
                  Enable 2FA
                </button>
              </div>
              <div className="pt-4 border-t border-white/[0.08]">
                <h4 className="text-[16px] font-medium text-white mb-2">Active Sessions</h4>
                <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Monitor className="h-8 w-8 text-indigo-400" />
                    <div>
                      <p className="text-[14px] font-medium text-white">Windows PC • Chrome</p>
                      <p className="text-[12px] text-slate-400 mt-0.5">Current session • Active now</p>
                    </div>
                  </div>
                  <span className="text-[12px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full ring-1 ring-inset ring-emerald-500/20">Active</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
