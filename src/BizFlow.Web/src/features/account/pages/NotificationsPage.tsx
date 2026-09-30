import { useState } from 'react';
import { notificationService } from '../../../services/notificationService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, AlertTriangle, User, Shield, Info, Check, Loader2, Bell } from 'lucide-react';

const getNotificationIcon = (type: number) => {
  switch (type) {
    case 1: return <FileText className="h-5 w-5 text-blue-400" />;
    case 2: return <AlertTriangle className="h-5 w-5 text-rose-400" />;
    case 3: return <User className="h-5 w-5 text-indigo-400" />;
    case 4: return <Shield className="h-5 w-5 text-emerald-400" />;
    default: return <Info className="h-5 w-5 text-slate-400" />;
  }
};

export const NotificationsPage = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const queryClient = useQueryClient();

  const { data: pagedResult, isLoading } = useQuery({
    queryKey: ['notifications', 'page', filter],
    queryFn: () => notificationService.getNotifications({ 
      pageNumber: 1, 
      pageSize: 50, 
      unreadOnly: filter === 'unread' 
    }),
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-white tracking-tight">Notifications</h1>
          <p className="text-[16px] text-slate-400 mt-1">Stay updated with activity across your workspace.</p>
        </div>
        <button
          onClick={() => markAllAsReadMutation.mutate()}
          disabled={markAllAsReadMutation.isPending}
          className="inline-flex items-center px-4 py-2 text-[14px] font-medium rounded-xl text-slate-300 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] hover:text-white transition-colors disabled:opacity-50"
        >
          {markAllAsReadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
          Mark all as read
        </button>
      </div>

      <div className="premium-card">
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center space-x-4 bg-white/[0.01]">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'}`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'unread' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'}`}
          >
            Unread
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : !pagedResult || pagedResult.items.length === 0 ? (
          <div className="py-20 px-6 text-center">
            <div className="mx-auto w-16 h-16 bg-white/[0.02] rounded-full flex items-center justify-center mb-4 border border-white/[0.05]">
              <Bell className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No notifications yet</h3>
            <p className="text-slate-400">You're all caught up! New updates will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {pagedResult.items.map((notification) => (
              <div 
                key={notification.id}
                className={`p-6 flex items-start gap-4 transition-colors ${!notification.isRead ? 'bg-indigo-500/[0.02]' : ''}`}
              >
                <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${!notification.isRead ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-white/[0.03] border-white/[0.05]'}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className={`text-base ${!notification.isRead ? 'text-white font-semibold' : 'text-slate-300 font-medium'}`}>
                        {notification.title}
                      </h4>
                      <p className="mt-1 text-sm text-slate-400 leading-relaxed max-w-2xl">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                          disabled={markAsReadMutation.isPending}
                          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-md transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
