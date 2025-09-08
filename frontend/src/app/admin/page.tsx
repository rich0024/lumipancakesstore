'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AdminPhotocardForm from '@/components/AdminPhotocardForm';
import AdminPhotocardList from '@/components/AdminPhotocardList';
import AdminPrintForm from '@/components/AdminPrintForm';
import AdminPrintList from '@/components/AdminPrintList';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Photocard, Print } from '@/types/menu';
import { useAuth } from '@/contexts/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'photocards' | 'prints'>('photocards');
  const [photocards, setPhotocards] = useState<Photocard[]>([]);
  const [prints, setPrints] = useState<Print[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<Photocard | null>(null);
  const [editingPrint, setEditingPrint] = useState<Print | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPhotocards();
    fetchPrints();
  }, []);

  const fetchPhotocards = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/admin/photocards', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch photocards');
      }
      const data = await response.json();
      setPhotocards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchPrints = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/admin/prints', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch prints');
      }
      const data = await response.json();
      setPrints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCard = async (cardData: Partial<Photocard>) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/admin/photocards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create photocard');
      }

      const newCard = await response.json();
      setPhotocards(prev => [...prev, newCard]);
      setShowForm(false);
      setEditingCard(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create photocard');
    }
  };

  const handleUpdateCard = async (id: number, cardData: Partial<Photocard>) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/admin/photocards/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update photocard');
      }

      const updatedCard = await response.json();
      setPhotocards(prev => 
        prev.map(card => card.id === id ? updatedCard : card)
      );
      setShowForm(false);
      setEditingCard(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update photocard');
    }
  };

  const handleDeleteCard = async (id: number) => {
    if (!confirm('Are you sure you want to delete this photocard?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/admin/photocards/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete photocard');
      }

      setPhotocards(prev => prev.filter(card => card.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete photocard');
    }
  };

  const handleEditCard = (card: Photocard) => {
    setEditingCard(card);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingCard(null);
    setEditingPrint(null);
    setShowForm(false);
  };

  // Print CRUD operations
  const handleCreatePrint = async (printData: Partial<Print>) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/admin/prints', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(printData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create print');
      }

      const newPrint = await response.json();
      setPrints(prev => [...prev, newPrint]);
      setShowForm(false);
      setEditingPrint(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create print');
    }
  };

  const handleUpdatePrint = async (id: number, printData: Partial<Print>) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/admin/prints/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(printData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update print');
      }

      const updatedPrint = await response.json();
      setPrints(prev => 
        prev.map(print => print.id === id ? updatedPrint : print)
      );
      setShowForm(false);
      setEditingPrint(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update print');
    }
  };

  const handleDeletePrint = async (id: number) => {
    if (!confirm('Are you sure you want to delete this print?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/admin/prints/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete print');
      }

      setPrints(prev => prev.filter(print => print.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete print');
    }
  };

  const handleEditPrint = (print: Print) => {
    setEditingPrint(print);
    setShowForm(true);
  };

  // Bulk delete operations
  const handleBulkDeletePhotocards = async (ids: number[]) => {
    try {
      const token = localStorage.getItem('authToken');
      const deletePromises = ids.map(id => 
        fetch(`http://localhost:3001/api/admin/photocards/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      );

      const responses = await Promise.all(deletePromises);
      const failedDeletes = responses.filter(response => !response.ok);

      if (failedDeletes.length > 0) {
        throw new Error(`Failed to delete ${failedDeletes.length} photocards`);
      }

      setPhotocards(prev => prev.filter(card => !ids.includes(card.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete photocards');
    }
  };

  const handleBulkDeletePrints = async (ids: number[]) => {
    try {
      const token = localStorage.getItem('authToken');
      const deletePromises = ids.map(id => 
        fetch(`http://localhost:3001/api/admin/prints/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      );

      const responses = await Promise.all(deletePromises);
      const failedDeletes = responses.filter(response => !response.ok);

      if (failedDeletes.length > 0) {
        throw new Error(`Failed to delete ${failedDeletes.length} prints`);
      }

      setPrints(prev => prev.filter(print => !ids.includes(print.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete prints');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Admin Panel - Inventory Management
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Welcome, {user?.name}! Manage your inventory, add new items, and update existing ones.
            </p>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('photocards')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'photocards'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Photocards
              </button>
              <button
                onClick={() => setActiveTab('prints')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'prints'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Prints
              </button>
            </div>
          </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
            <button 
              onClick={() => setError(null)}
              className="float-right text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'photocards' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Add New Photocard
              </button>
            </div>

            {showForm && (
              <div className="mb-8">
                <AdminPhotocardForm
                  card={editingCard}
                  onSubmit={editingCard ? 
                    (data) => handleUpdateCard(editingCard.id, data) : 
                    handleCreateCard
                  }
                  onCancel={handleCancelEdit}
                />
              </div>
            )}

            <AdminPhotocardList
              photocards={photocards}
              onEdit={handleEditCard}
              onDelete={handleDeleteCard}
              onBulkDelete={handleBulkDeletePhotocards}
            />
          </>
        )}

        {activeTab === 'prints' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Add New Print
              </button>
            </div>

            {showForm && (
              <div className="mb-8">
                <AdminPrintForm
                  print={editingPrint}
                  onSubmit={editingPrint ? 
                    (data) => handleUpdatePrint(editingPrint.id, data) : 
                    handleCreatePrint
                  }
                  onCancel={handleCancelEdit}
                />
              </div>
            )}

            <AdminPrintList
              prints={prints}
              onEdit={handleEditPrint}
              onDelete={handleDeletePrint}
              onBulkDelete={handleBulkDeletePrints}
            />
          </>
        )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
