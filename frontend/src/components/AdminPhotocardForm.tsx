'use client';

import { useState, useEffect } from 'react';
import { Photocard } from '@/types/menu';

interface AdminPhotocardFormProps {
  card?: Photocard | null;
  onSubmit: (data: Partial<Photocard>) => void;
  onCancel: () => void;
}

export default function AdminPhotocardForm({ card, onSubmit, onCancel }: AdminPhotocardFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    group: '',
    member: '',
    album: '',
    set: '',
    age: '',
    rarity: 'Album' as 'Album' | 'Preorder Benefit' | 'Lucky Draw',
    category: '',
    quantity: '1'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name || '',
        description: card.description || '',
        price: card.price?.toString() || '',
        image: card.image || '',
        group: card.group || '',
        member: card.member || '',
        album: card.album || '',
        set: card.set || '',
        age: card.age || '',
        rarity: card.rarity || 'Album',
        category: card.category || '',
        quantity: card.quantity?.toString() || '1'
      });
      setImagePreview(card.image || '');
    }
  }, [card]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = formData.image;
    
    // If a new file is uploaded, upload it first
    if (imageFile) {
      const formDataUpload = new FormData();
      formDataUpload.append('image', imageFile);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        const result = await response.json();
        imageUrl = result.url;
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
        return;
      }
    }
    
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      image: imageUrl
    };
    
    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rarity' ? value as 'Album' | 'Preorder Benefit' | 'Lucky Draw' : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {card ? 'Edit Photocard' : 'Add New Photocard'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Card Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., BTS - Jungkook Photocard"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="12.99"
            />
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="1"
            />
          </div>

          {/* Group */}
          <div>
            <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-2">
              Group *
            </label>
            <input
              type="text"
              id="group"
              name="group"
              value={formData.group}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., BTS"
            />
          </div>

          {/* Member */}
          <div>
            <label htmlFor="member" className="block text-sm font-medium text-gray-700 mb-2">
              Member *
            </label>
            <input
              type="text"
              id="member"
              name="member"
              value={formData.member}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., Jungkook"
            />
          </div>

          {/* Album */}
          <div>
            <label htmlFor="album" className="block text-sm font-medium text-gray-700 mb-2">
              Album *
            </label>
            <input
              type="text"
              id="album"
              name="album"
              value={formData.album}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., Proof"
            />
          </div>

          {/* Set */}
          <div>
            <label htmlFor="set" className="block text-sm font-medium text-gray-700 mb-2">
              Set (Optional)
            </label>
            <input
              type="text"
              id="set"
              name="set"
              value={formData.set}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., Proof Standard"
            />
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Age (Optional)
            </label>
            <input
              type="text"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., 2023"
            />
          </div>

          {/* Rarity */}
          <div>
            <label htmlFor="rarity" className="block text-sm font-medium text-gray-700 mb-2">
              Rarity
            </label>
            <select
              id="rarity"
              name="rarity"
              value={formData.rarity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="Album">Album</option>
              <option value="Preorder Benefit">Preorder Benefit</option>
              <option value="Lucky Draw">Lucky Draw</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., bts"
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Image Upload
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
            {!imageFile && formData.image && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Current image:</p>
                <img
                  src={formData.image}
                  alt="Current"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Describe the photocard..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors duration-200"
          >
            {card ? 'Update Photocard' : 'Add Photocard'}
          </button>
        </div>
      </form>
    </div>
  );
}
