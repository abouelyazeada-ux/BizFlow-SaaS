export interface DashboardOverviewDto {
  totalRevenue: number;
  totalInvoices: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProductsCount: number;
  pendingInvoicesCount: number;
}

export interface RevenueDataPoint {
  label: string;
  revenue: number;
  invoiceCount: number;
}

export interface SalesAnalyticsDto {
  averageInvoiceValue: number;
  totalInvoices: number;
  revenueByDay: RevenueDataPoint[];
  revenueByMonth: RevenueDataPoint[];
}

export interface ProductSummaryDto {
  id: string;
  name: string;
  quantity: number;
  price: number;
  stockStatus: string;
  salesCount: number;
}

export interface InventoryAnalyticsDto {
  totalInventoryValue: number;
  lowStockProductsCount: number;
  outOfStockProductsCount: number;
  lowStockProducts: ProductSummaryDto[];
  topSellingProducts: ProductSummaryDto[];
}

export interface RecentActivityDto {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}
