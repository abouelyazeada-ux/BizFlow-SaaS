import React from 'react';
import type { RecentActivityDto } from '../types/dashboard.types';
import { FileText, User, Package, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentActivitiesProps {
  activities: RecentActivityDto[];
  isLoading: boolean;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'Invoice': return <FileText className="h-4 w-4 text-indigo-400" />;
    case 'Customer': return <User className="h-4 w-4 text-emerald-400" />;
    case 'Product': return <Package className="h-4 w-4 text-amber-400" />;
    default: return <Clock className="h-4 w-4 text-slate-400" />;
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, isLoading }) => {
  return (
    <div className="premium-card p-6 h-full relative z-10">
      <div className="mb-6 relative z-10">
        <h3 className="text-base font-semibold text-white">Recent Activity</h3>
        <p className="text-sm text-slate-400">Latest actions across your workspace.</p>
      </div>

      <div className="flow-root">
        {isLoading ? (
          <div className="space-y-4 relative z-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex space-x-3">
                <div className="h-8 w-8 bg-white/[0.05] rounded-full animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-white/[0.05] rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-white/[0.05] rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-4 relative z-10">No recent activities.</div>
        ) : (
          <ul role="list" className="-mb-8 relative z-10">
            {activities.map((activity, activityIdx) => {
              const route = activity.type === 'Invoice' ? `/invoices/${activity.id}`
                          : activity.type === 'Customer' ? `/customers/${activity.id}`
                          : activity.type === 'Product' ? `/products/${activity.id}`
                          : null;

              return (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== activities.length - 1 ? (
                      <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-white/[0.08]" aria-hidden="true" />
                    ) : null}
                    {route ? (
                      <Link to={route} className="relative flex space-x-3 p-2 -m-2 rounded-lg hover:bg-white/[0.02] transition-colors group">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-[#0A0A0A] ring-8 ring-[#0A0A0A] flex items-center justify-center border border-white/[0.1] group-hover:border-indigo-500/50 transition-colors">
                            {getActivityIcon(activity.type)}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors">{activity.description}</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-xs text-slate-500 group-hover:text-slate-400">
                            <time dateTime={activity.timestamp}>{formatTimeAgo(activity.timestamp)}</time>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="relative flex space-x-3 p-2 -m-2">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-[#0A0A0A] ring-8 ring-[#0A0A0A] flex items-center justify-center border border-white/[0.1]">
                            {getActivityIcon(activity.type)}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-slate-300">{activity.description}</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-xs text-slate-500">
                            <time dateTime={activity.timestamp}>{formatTimeAgo(activity.timestamp)}</time>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
