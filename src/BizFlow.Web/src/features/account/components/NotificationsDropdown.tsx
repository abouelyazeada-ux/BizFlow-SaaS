import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Loader2, Info, FileText, AlertTriangle, User, Shield } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, type NotificationDto } from '../../../services/notificationService';
import { AnimatePresence, motion } from 'framer-motion';

const getNotificationIcon = (type: number) => {
  switch (type) {
    case 1: return <FileText className="h-4 w-4 text-blue-400" />; // Invoice
    case 2: return <AlertTriangle className="h-4 w-4 text-rose-400" />; // LowStock
    case 3: return <User className="h-4 w-4 text-indigo-400" />; // Customer
    case 4: return <Shield className="h-4 w-4 text-emerald-400" />; // System
    default: return <Info className="h-4 w-4 text-slate-400" />; // General
  }
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Poll for unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 30000, // poll every 30 seconds
  });

  // Fetch notifications only when dropdown opens
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications', 'dropdown'],
    queryFn: () => notificationService.getNotifications({ pageNumber: 1, pageSize: 5 }),
    enabled: isOpen,
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification: NotificationDto) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="View notifications"
        className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-200 rounded-xl hover:bg-white/[0.05] transition-colors relative focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-3 h-2.5 w-2.5 rounded-full bg-indigo-500 border-2 border-[#0A0A0A]"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-[380px] origin-top-right rounded-2xl bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden focus:outline-none z-50 flex flex-col max-h-[480px]"
          >
            <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium disabled:opacity-50"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                </div>
              ) : notificationsData?.items.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <div className="mx-auto w-10 h-10 bg-white/[0.03] rounded-full flex items-center justify-center mb-3">
                    <Bell className="h-5 w-5 text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-400">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.05]">
                  {notificationsData?.items.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left px-4 py-3 hover:bg-white/[0.04] transition-colors flex items-start space-x-3 group ${!notification.isRead ? 'bg-indigo-500/[0.03]' : ''}`}
                    >
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${!notification.isRead ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-white/[0.05] border-white/[0.05]'}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className={`text-sm truncate pr-2 ${!notification.isRead ? 'text-white font-medium' : 'text-slate-300 font-normal'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[11px] text-slate-500 shrink-0 mt-0.5">
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-[13px] text-slate-400 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-2 border-t border-white/[0.08] bg-white/[0.02]">
              <button
                onClick={handleViewAll}
                className="w-full py-2 text-[13px] font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
