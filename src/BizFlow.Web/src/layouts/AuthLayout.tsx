import { Outlet } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const AuthLayout = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen flex bg-[#030303] overflow-hidden text-white selection:bg-indigo-500/30">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: mousePosition.x * 2, y: mousePosition.y * 2 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen" 
        />
        <motion.div 
          animate={{ x: -mousePosition.x * 3, y: -mousePosition.y * 3 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/15 blur-[120px] mix-blend-screen" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay"></div>
      </div>

      {/* Left Panel - Branding */}
      <div className="relative hidden lg:flex w-[55%] flex-col justify-between px-[8vw] py-16 border-r border-white/[0.05] bg-black/40 backdrop-blur-3xl z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center space-x-3 text-white"
        >
          <div className="p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Layers className="h-10 w-10 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight">BizFlow</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="my-auto py-12"
        >
          <div className="inline-block px-5 py-2.5 mb-8 text-base font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            BizFlow 2.0 is now live
          </div>
          <h1 className="text-[52px] xl:text-[64px] font-bold tracking-tight mb-8 leading-[1.1] text-slate-100 max-w-[680px]">
            Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">beautiful</span> software<br />faster than ever.
          </h1>
          <p className="text-[18px] xl:text-[20px] text-slate-400 max-w-[600px] font-light leading-[1.6]">
            The premium platform for modern SaaS teams. Manage workspaces, automate workflows, and scale your product elegantly.
          </p>
        </motion.div>
        
        <div className="text-base text-slate-500 font-light">
          © {new Date().getFullYear()} BizFlow Inc. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[520px]"
        >
          {/* Mobile Header */}
          <div className="flex lg:hidden justify-center text-white items-center space-x-3 mb-12">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-sm">
              <Layers className="h-10 w-10 text-indigo-400" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight">BizFlow</h2>
          </div>

          <div className="mb-10 lg:mb-12">
            <h2 className="text-[32px] font-bold tracking-tight text-white mb-3">Welcome back</h2>
            <p className="text-[16px] xl:text-[18px] text-slate-400 font-light">Enter your credentials to access your workspace</p>
          </div>

          <motion.div 
            whileHover={{ y: -2 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] p-10 sm:p-12 shadow-2xl relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-[24px] pointer-events-none" />
            
            <div className="relative z-10 [&_label]:text-slate-300 [&_label]:font-medium [&_label]:text-[15px] [&_input]:bg-white/[0.03] [&_input]:border-white/[0.08] [&_input]:text-white [&_input]:focus:border-indigo-500 [&_input]:focus:ring-2 [&_input]:focus:ring-indigo-500 [&_input]:focus:bg-white/[0.05] [&_input]:transition-all [&_input]:duration-300 [&_button]:bg-white [&_button]:text-black [&_button]:font-semibold [&_button]:hover:bg-slate-200 [&_button]:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <Outlet />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
