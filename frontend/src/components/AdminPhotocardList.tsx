'use client';

import { useState, useMemo } from 'react';
import { Photocard } from '@/types/menu';

interface AdminPhotocardListProps {
  photocards: Photocard[];
  onEdit: (card: Photocard) => void;
  onDelete: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
}

export default function AdminPhotocardList({ photocards, onEdit, onDelete, onBulkDelete }: AdminPhotocardListProps) {
  const [sortField, setSortField] = useState<keyof Photocard>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedPhotocards = useMemo(() => {
    // First filter by search term
    const filtered = photocards.filter(card => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        card.name.toLowerCase().includes(searchLower) ||
        card.description.toLowerCase().includes(searchLower) ||
        card.group.toLowerCase().includes(searchLower) ||
        card.member.toLowerCase().includes(searchLower) ||
        card.album.toLowerCase().includes(searchLower) ||
        (card.set && card.set.toLowerCase().includes(searchLower)) ||
        card.rarity.toLowerCase().includes(searchLower) ||
        card.price.toString().includes(searchTerm) ||
        card.quantity.toString().includes(searchTerm)
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
  }, [photocards, sortField, sortOrder, searchTerm]);

  const handleSort = (field: keyof Photocard) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === photocards.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(photocards.map(card => card.id));
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
    if (confirm(`Are you sure you want to delete ${selectedIds.length} photocards?`)) {
      onBulkDelete?.(selectedIds);
      setSelectedIds([]);
    }
  };

  if (photocards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No photocards found</h3>
        <p className="text-gray-500">Add your first photocard to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Photocard Inventory</h2>
            <p className="text-sm text-gray-600">Manage your photocard collection</p>
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
                placeholder="Search photocards..."
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
              {filteredAndSortedPhotocards.length} of {photocards.length} results
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
                  checked={selectedIds.length === photocards.length && photocards.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Card</span>
                  {sortField === 'name' && (
                    <span className="text-pink-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('group')}
              >
                <div className="flex items-center space-x-1">
                  <span>Group/Member</span>
                  {sortField === 'group' && (
                    <span className="text-pink-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('album')}
              >
                <div className="flex items-center space-x-1">
                  <span>Album/Set</span>
                  {sortField === 'album' && (
                    <span className="text-pink-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('age')}
              >
                <div className="flex items-center space-x-1">
                  <span>Age</span>
                  {sortField === 'age' && (
                    <span className="text-pink-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('rarity')}
              >
                <div className="flex items-center space-x-1">
                  <span>Rarity</span>
                  {sortField === 'rarity' && (
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
            {filteredAndSortedPhotocards.map((card) => (
              <tr key={card.id} className={`hover:bg-gray-50 ${selectedIds.includes(card.id) ? 'bg-pink-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(card.id)}
                    onChange={() => handleSelectItem(card.id)}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center">
                        <span className="text-xl">📸</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {card.name}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {card.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{card.group}</div>
                  <div className="text-sm text-gray-500">{card.member}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{card.album}</div>
                  {card.set && (
                    <div className="text-sm text-gray-500">{card.set}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {card.age || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    card.rarity === 'Album' ? 'bg-gray-100 text-gray-800' :
                    card.rarity === 'Preorder Benefit' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {card.rarity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${card.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    card.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {card.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(card)}
                      className="text-pink-600 hover:text-pink-900 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(card.id)}
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
