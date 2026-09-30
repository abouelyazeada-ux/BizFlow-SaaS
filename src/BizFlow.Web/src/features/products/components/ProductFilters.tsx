import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

interface ProductFiltersProps {
  onSearch: (searchTerm: string) => void;
  onFilterStatus: (status: string) => void;
  initialSearchTerm: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ onSearch, onFilterStatus, initialSearchTerm }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          className="block w-full rounded-md border border-slate-300 py-2 pl-10 pr-3 leading-5 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm shadow-sm transition-colors"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="sm:w-48">
        <select
          className="block w-full rounded-md border border-slate-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm shadow-sm"
          onChange={(e) => onFilterStatus(e.target.value)}
          defaultValue=""
        >
          <option value="">All Stock Statuses</option>
          <option value="InStock">In Stock</option>
          <option value="LowStock">Low Stock</option>
          <option value="OutOfStock">Out of Stock</option>
        </select>
      </div>
    </div>
  );
};
