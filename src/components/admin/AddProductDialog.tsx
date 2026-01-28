import React, { useState } from 'react';
import { Plus, X, Image as ImageIcon, Search } from 'lucide-react';
import { type Product, getProducts, saveProducts } from '../../data/mockData';
import { useDataSync } from '../../contexts/DataSyncContext';

interface AddProductDialogProps {
  onProductAdded: () => void;
}

export default function AddProductDialog({ onProductAdded }: AddProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Ceiling' as Product['category'],
    price: '',
    stock: '',
    description: '',
    lowStockThreshold: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const { broadcastChange } = useDataSync();

  const categories: Product['category'][] = ['Ceiling', 'Wall', 'Decorative', 'LED Bulbs', 'Fixtures'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.name || !formData.price || !formData.stock || !formData.description || !formData.lowStockThreshold) {
      alert('Please fill in all fields');
      return;
    }

    // Create new product
    const products = getProducts();
    const newProduct: Product = {
      id: `p${Date.now()}`,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      description: formData.description,
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      image: formData.image || 'product-placeholder',
    };

    // Save
    saveProducts([...products, newProduct]);
    
    // Broadcast product creation to all tabs/users
    broadcastChange('products', 'create');
    
    // Reset form
    setFormData({
      name: '',
      category: 'Ceiling',
      price: '',
      stock: '',
      description: '',
      lowStockThreshold: '',
      image: '',
    });
    setImagePreview('');
    
    setIsOpen(false);
    onProductAdded();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({
          ...prev,
          image: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-3 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-800 rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Product</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Add New Product</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Price (₱) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Low Stock Threshold */}
              <div>
                <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Low Stock Threshold *
                </label>
                <input
                  type="number"
                  id="lowStockThreshold"
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                  placeholder="10"
                  min="0"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                  placeholder="Enter product description"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Product Image
                </label>
                
                {/* Image URL Input */}
                <div className="mb-3">
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={(e) => {
                      handleChange(e);
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                    placeholder="Enter image URL (e.g., from Unsplash)"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Tip: Search for images on <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-stone-500 dark:text-stone-400 underline">Unsplash</a> and paste the URL here
                  </p>
                </div>

                {/* Or Upload File */}
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="imageFile"
                    className="flex items-center gap-2 px-4 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span>Or Upload Image</span>
                  </label>
                  
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-neutral-300 dark:border-neutral-600"
                        onError={(e) => {
                          e.currentTarget.src = '';
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                        onClick={() => {
                          setImagePreview('');
                          setFormData(prev => ({
                            ...prev,
                            image: '',
                          }));
                        }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-800 rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}