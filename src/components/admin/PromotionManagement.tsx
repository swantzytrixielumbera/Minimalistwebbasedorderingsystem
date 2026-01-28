import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Calendar, Percent, Users } from 'lucide-react';
import { type Promotion, getPromotions, savePromotions } from '../../data/mockData';
import { useDataSync } from '../../contexts/DataSyncContext';

interface PromotionManagementProps {
  onUpdate: () => void;
}

export default function PromotionManagement({ onUpdate }: PromotionManagementProps) {
  const [promotions, setPromotions] = useState<Promotion[]>(getPromotions());
  const [showDialog, setShowDialog] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    validFrom: '',
    validTo: '',
    active: true,
    maxUses: '',
    currentUses: '0'
  });
  const { broadcastChange } = useDataSync();

  const handleAddPromotion = () => {
    setEditingPromotion(null);
    setFormData({
      code: '',
      discount: '',
      validFrom: '',
      validTo: '',
      active: true,
      maxUses: '',
      currentUses: '0'
    });
    setShowDialog(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      code: promotion.code,
      discount: promotion.discount.toString(),
      validFrom: promotion.validFrom,
      validTo: promotion.validTo,
      active: promotion.active,
      maxUses: promotion.maxUses ? promotion.maxUses.toString() : '',
      currentUses: promotion.currentUses ? promotion.currentUses.toString() : '0'
    });
    setShowDialog(true);
  };

  const handleDeletePromotion = (id: string) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      const updatedPromotions = promotions.filter(p => p.id !== id);
      savePromotions(updatedPromotions);
      setPromotions(updatedPromotions);
      
      // Broadcast promotion deletion to all tabs/users
      broadcastChange('promotions', 'delete');
      
      onUpdate();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPromotion: Promotion = {
      id: editingPromotion ? editingPromotion.id : `pr${Date.now()}`,
      code: formData.code.toUpperCase(),
      discount: parseFloat(formData.discount),
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      active: formData.active,
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
      currentUses: formData.currentUses ? parseInt(formData.currentUses) : 0
    };

    let updatedPromotions;
    if (editingPromotion) {
      updatedPromotions = promotions.map(p => p.id === editingPromotion.id ? newPromotion : p);
    } else {
      updatedPromotions = [newPromotion, ...promotions];
    }

    savePromotions(updatedPromotions);
    setPromotions(updatedPromotions);
    
    // Broadcast promotion change to all tabs/users
    broadcastChange('promotions', editingPromotion ? 'update' : 'create');
    
    setShowDialog(false);
    onUpdate();
  };

  const isPromotionValid = (promotion: Promotion) => {
    const today = new Date().toISOString().split('T')[0];
    return promotion.active && today >= promotion.validFrom && today <= promotion.validTo;
  };

  const activePromotions = promotions.filter(p => isPromotionValid(p));
  const expiredPromotions = promotions.filter(p => !isPromotionValid(p));

  return (
    <div>
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Promotion Management</h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">Create and manage promotional codes</p>
        </div>
        <button
          onClick={handleAddPromotion}
          className="bg-stone-400 hover:bg-stone-500 dark:bg-stone-600 dark:hover:bg-stone-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Promotion
        </button>
      </div>

      {/* Active Promotions */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">Active Promotions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activePromotions.map(promotion => (
            <div key={promotion.id} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-stone-500 dark:text-stone-400" />
                  <span className="font-mono font-bold text-lg text-neutral-800 dark:text-neutral-200">{promotion.code}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditPromotion(promotion)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </button>
                  <button
                    onClick={() => handleDeletePromotion(promotion.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">{promotion.discount}% OFF</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Calendar className="w-4 h-4" />
                  <span>{promotion.validFrom} to {promotion.validTo}</span>
                </div>
                {promotion.maxUses && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Users className="w-4 h-4" />
                    <span>{promotion.currentUses || 0} / {promotion.maxUses} uses</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
          ))}
          {activePromotions.length === 0 && (
            <div className="col-span-full text-center py-12 text-neutral-500 dark:text-neutral-400">
              No active promotions
            </div>
          )}
        </div>
      </div>

      {/* Expired/Inactive Promotions */}
      {expiredPromotions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">Expired/Inactive Promotions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiredPromotions.map(promotion => (
              <div key={promotion.id} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-6 opacity-60">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-stone-500 dark:text-stone-400" />
                    <span className="font-mono font-bold text-lg text-neutral-800 dark:text-neutral-200">{promotion.code}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPromotion(promotion)}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </button>
                    <button
                      onClick={() => handleDeletePromotion(promotion.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                    <span className="text-2xl font-bold text-neutral-600 dark:text-neutral-400">{promotion.discount}% OFF</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Calendar className="w-4 h-4" />
                    <span>{promotion.validFrom} to {promotion.validTo}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                    {promotion.active ? 'Expired' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowDialog(false)}>
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                {editingPromotion ? 'Edit Promotion' : 'Add Promotion'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Promo Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 text-neutral-800 dark:text-neutral-200 font-mono uppercase"
                    placeholder="SAVE10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 text-neutral-800 dark:text-neutral-200"
                    placeholder="10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Valid From
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 text-neutral-800 dark:text-neutral-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Valid To
                  </label>
                  <input
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 text-neutral-800 dark:text-neutral-200"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-stone-400 dark:text-stone-600 border-neutral-300 dark:border-neutral-600 rounded focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Active
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Max Uses
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 text-neutral-800 dark:text-neutral-200"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Current Uses
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.currentUses}
                    onChange={(e) => setFormData({ ...formData, currentUses: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 text-neutral-800 dark:text-neutral-200"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  className="flex-1 px-4 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-stone-400 dark:bg-stone-600 text-white rounded-lg font-medium hover:bg-stone-500 dark:hover:bg-stone-700 transition-colors"
                >
                  {editingPromotion ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}