'use client';

import { useState, useMemo } from 'react';
import { Print } from '@/types/menu';

interface AdminPrintListProps {
  prints: Print[];
  onEdit: (print: Print) => void;
  onDelete: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
}

export default function AdminPrintList({ prints, onEdit, onDelete, onBulkDelete }: AdminPrintListProps) {
  const [sortField, setSortField] = useState<keyof Print>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedPrints = useMemo(() => {
    // First filter by search term
    const filtered = prints.filter(print => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        print.name.toLowerCase().includes(searchLower) ||
        print.description.toLowerCase().includes(searchLower) ||
        print.price.toString().includes(searchTerm) ||
        print.quantity.toString().includes(searchTerm)
      );
    });

    // Then sort the filtered results
    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return sortOrder === 'asc' ? 1 : -1;
      if (bValue === undefined) return sortOrder === 'asc' ? -1 : 1;

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [prints, sortField, sortOrder, searchTerm]);

  const handleSort = (field: keyof Print) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === prints.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(prints.map(print => print.id));
    }
  };

  const handleSelectItem = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.length} prints?`)) {
      onBulkDelete?.(selectedIds);
      setSelectedIds([]);
    }
  };

  if (prints.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🖼️</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No prints found</h3>
        <p className="text-gray-500">Add your first print to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Print Inventory</h2>
            <p className="text-sm text-gray-600">Manage your print collection</p>
          </div>
          {selectedIds.length > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {selectedIds.length} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search prints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          {searchTerm && (
            <div className="text-sm text-gray-600">
              {filteredAndSortedPrints.length} of {prints.length} results
            </div>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedIds.length === prints.length && prints.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Print</span>
                  {sortField === 'name' && (
                    <span className="text-pink-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center space-x-1">
                  <span>Price</span>
                  {sortField === 'price' && (
                    <span className="text-pink-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center space-x-1">
                  <span>Quantity</span>
                  {sortField === 'quantity' && (
                    <span className="text-pink-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedPrints.map((print) => (
              <tr key={print.id} className={`hover:bg-gray-50 ${selectedIds.includes(print.id) ? 'bg-pink-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(print.id)}
                    onChange={() => handleSelectItem(print.id)}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🖼️</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {print.name}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {print.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${print.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    print.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {print.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(print)}
                      className="text-pink-600 hover:text-pink-900 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(print.id)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
