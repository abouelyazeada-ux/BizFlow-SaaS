import { useState, useMemo } from 'react';
import { StatCard } from '../components/StatCard';
import { RevenueChart } from '../components/RevenueChart';
import { SalesChart } from '../components/SalesChart';
import { RecentActivities } from '../components/RecentActivities';
import { LowStockTable } from '../components/LowStockTable';
import { 
  useDashboardOverview, 
  useSalesAnalytics, 
  useInventoryAnalytics, 
  useRecentActivities 
} from '../hooks/useDashboard';
import { DollarSign, Users, Package, FileText, Calendar, ArrowUpRight, Loader2, Check, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../../../services/apiClient';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export const DashboardPage = () => {
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | '90days'>('30days');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const dateParams = useMemo(() => {
    const end = new Date();
    const start = new Date();
    if (dateRange === 'today') {
      start.setHours(0, 0, 0, 0);
    } else if (dateRange === '7days') {
      start.setDate(end.getDate() - 7);
    } else if (dateRange === '30days') {
      start.setDate(end.getDate() - 30);
    } else if (dateRange === '90days') {
      start.setDate(end.getDate() - 90);
    }
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  }, [dateRange]);

  const { data: overview, isLoading: isOverviewLoading } = useDashboardOverview(dateParams);
  const { data: sales, isLoading: isSalesLoading } = useSalesAnalytics(dateParams);
  const { data: inventory, isLoading: isInventoryLoading } = useInventoryAnalytics();
  const { data: activities, isLoading: isActivitiesLoading } = useRecentActivities(6);
  const navigate = useNavigate();

  const formatCurrency = (value: number | undefined) => {
    return value !== undefined ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00';
  };

  const formatNumber = (value: number | undefined) => {
    return value !== undefined ? value.toLocaleString() : '0';
  };

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    setDownloadSuccess(false);
    try {
        const response = await apiClient.get('/reports/dashboard', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'BizFlow_Report.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
        setDownloadError("Failed to download report");
        setTimeout(() => setDownloadError(null), 3000);
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-white tracking-tight">Overview</h1>
          <p className="mt-2 text-[16px] text-slate-400 font-light">
            Welcome back. Here's what's happening with your business today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              className="inline-flex items-center justify-center rounded-xl bg-white/[0.03] px-5 h-[48px] text-[15px] font-semibold text-slate-200 shadow-sm border border-white/[0.08] hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors w-[180px]">
              <Calendar className="-ml-1 mr-2 h-[20px] w-[20px] text-slate-400" />
              {dateRange === 'today' ? 'Today' : 
               dateRange === '7days' ? 'Last 7 Days' : 
               dateRange === '30days' ? 'Last 30 Days' : 'Last 90 Days'}
              <ChevronDown className="ml-2 -mr-1 h-[16px] w-[16px] text-slate-400" />
            </button>
            {isDateDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDateDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-full rounded-xl bg-[#1A1A1A] border border-white/[0.08] shadow-lg shadow-black/50 overflow-hidden z-50">
                  <div className="py-1">
                    {[
                      { id: 'today', label: 'Today' },
                      { id: '7days', label: 'Last 7 Days' },
                      { id: '30days', label: 'Last 30 Days' },
                      { id: '90days', label: 'Last 90 Days' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setDateRange(option.id as any);
                          setIsDateDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2.5 text-[14px] ${
                          dateRange === option.id 
                            ? 'bg-indigo-500/10 text-indigo-400 font-medium' 
                            : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                        } transition-colors`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="relative">
            <button 
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 h-[48px] text-[15px] font-semibold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
              {isDownloading ? (
                  <>
                      <Loader2 className="mr-2 h-[20px] w-[20px] animate-spin" />
                      Generating report...
                  </>
              ) : downloadSuccess ? (
                  <>
                      <Check className="mr-2 h-[20px] w-[20px]" />
                      Downloaded successfully
                  </>
              ) : (
                  <>
                      Download Report
                      <ArrowUpRight className="ml-2 -mr-1 h-[20px] w-[20px]" />
                  </>
              )}
            </button>
            {downloadError && (
                <div className="absolute top-full mt-2 right-0 text-sm text-red-400 bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20 whitespace-nowrap">
                    {downloadError}
                </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(overview?.totalRevenue)}
          icon={<DollarSign className="h-5 w-5" />}
          isLoading={isOverviewLoading}
          trend={{ value: 12.5, isPositive: true }}
          onClick={() => navigate('/invoices')}
        />
        <StatCard
          title="Total Invoices"
          value={formatNumber(overview?.totalInvoices)}
          icon={<FileText className="h-5 w-5" />}
          isLoading={isOverviewLoading}
          trend={{ value: 4.1, isPositive: true }}
          onClick={() => navigate('/invoices')}
        />
        <StatCard
          title="Total Customers"
          value={formatNumber(overview?.totalCustomers)}
          icon={<Users className="h-5 w-5" />}
          isLoading={isOverviewLoading}
          trend={{ value: 2.3, isPositive: false }}
          onClick={() => navigate('/customers')}
        />
        <StatCard
          title="Products Catalog"
          value={formatNumber(overview?.totalProducts)}
          icon={<Package className="h-5 w-5" />}
          isLoading={isOverviewLoading}
          onClick={() => navigate('/products')}
        />
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[420px]">
          <RevenueChart data={sales?.revenueByDay || []} isLoading={isSalesLoading} onClick={() => navigate('/invoices')} />
        </div>
        <div className="h-[420px]">
          <SalesChart data={sales?.revenueByDay || []} isLoading={isSalesLoading} onClick={() => navigate('/invoices')} />
        </div>
      </motion.div>

      {/* Bottom Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-[440px]">
          <LowStockTable products={inventory?.lowStockProducts || []} isLoading={isInventoryLoading} />
        </div>
        <div className="lg:col-span-2 h-[440px]">
          <RecentActivities activities={activities || []} isLoading={isActivitiesLoading} />
        </div>
      </motion.div>
    </motion.div>
  );
};
