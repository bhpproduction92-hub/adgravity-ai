'use client';

import { useState, useEffect } from 'react';

export interface CategoryItem {
  id: string;
  name: string;
  vertical: string;
  layouts: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'cat_hospitals', name: 'Hospitals & Diagnostics', vertical: 'Medical & Healthcare', layouts: 'Red/Cross Accent, Urgent Care Cards' },
  { id: 'cat_pharmacies', name: 'Pharmacies & Chemists', vertical: 'Medical & Healthcare', layouts: 'Green/Capsule Grid, Medicose Theme' },
  { id: 'cat_clinics', name: 'Dental & Eye Clinics', vertical: 'Medical & Healthcare', layouts: 'Blue Clean Minimalist, Doctor Presets' },
  { id: 'cat_restaurants', name: 'Restaurants & Dhabas', vertical: 'Food & Hospitality', layouts: 'Warm Amber Bold Slogans, Food Hero Slider' },
  { id: 'cat_cafes', name: 'Cafes & Sweet Shops', vertical: 'Food & Hospitality', layouts: 'Cyberpunk Neon Mint, Cozy Coffee Grid' },
  { id: 'cat_bakeries', name: 'Bakeries & Confectioneries', vertical: 'Food & Hospitality', layouts: 'Sweet Pastel Gold, Cake Mockups' },
  { id: 'cat_hotels', name: 'Hotels & Homestays', vertical: 'Food & Hospitality', layouts: 'Luxury Silver/Indigo, Room Showcases' },
  { id: 'cat_groceries', name: 'Groceries & Kirana Stores', vertical: 'Retail & Commerce', layouts: 'Fresh Leaf Green, Daily Need Presets' },
  { id: 'cat_supermarkets', name: 'Supermarkets & Marts', vertical: 'Retail & Commerce', layouts: 'Vibrant Multi-Color, Discount Flags' },
  { id: 'cat_apparel', name: 'Apparel & Clothing Boutiques', vertical: 'Retail & Commerce', layouts: 'Modern Aesthetic Slate, Product Focus Loop' },
  { id: 'cat_electronics', name: 'Electronics & Mobile Shops', vertical: 'Retail & Commerce', layouts: 'Futuristic Electric Neon, Tech Spec Cards' },
  { id: 'cat_jewellery', name: 'Jewellery Showrooms', vertical: 'Retail & Commerce', layouts: 'Elegant Gold/Rose, Royal Ornament Display' },
  { id: 'cat_marketing', name: 'Marketing & Ad Agencies', vertical: 'Professional Services', layouts: 'High Contrast Bold Contrast, Conversion Grids' },
  { id: 'cat_legal', name: 'Legal & CA Firm Chambers', vertical: 'Professional Services', layouts: 'Formal Deep Navy, Trust Badges' },
  { id: 'cat_photography', name: 'Photography & Media Studios', vertical: 'Professional Services', layouts: 'Monochrome Dark Minimalist, Portfolio Frames' },
  { id: 'cat_salons', name: 'Salons & Wellness Spas', vertical: 'Professional Services', layouts: 'Chic Rose/Gold, Beauty Card Mockups' },
  { id: 'cat_education', name: 'Coaching & Tuition Institutes', vertical: 'Education', layouts: 'Corporate Slate/Indigo, Info Banner grids' },
  { id: 'cat_realestate', name: 'Real Estate & Builders', vertical: 'Real Estate', layouts: 'Sturdy Brick Brown, Plot/Home Showcase' },
  { id: 'cat_automobile', name: 'Automobile Dealers & Garages', vertical: 'Automobile', layouts: 'Sleek Racing Black, Speed Dial Accents' },
  { id: 'cat_agriculture', name: 'Agro Machinery & Nursery Farms', vertical: 'Agriculture & Farming', layouts: 'Organic Earth Brown/Green, Farm Fresh Badges' },
  { id: 'cat_logistics', name: 'Couriers & Transport Services', vertical: 'Logistics', layouts: 'Transit Orange/Blue, Speed Delivery Mockup' },
  { id: 'cat_msmes', name: 'Handicrafts & Handlooms', vertical: 'Local MSMEs', layouts: 'Handicraft Raw/Zinc Accent, Vocal For Local Banner' },
];

export const VERTICAL_OPTIONS = [
  'Medical & Healthcare',
  'Food & Hospitality',
  'Retail & Commerce',
  'Professional Services',
  'Education',
  'Real Estate',
  'Automobile',
  'Agriculture & Farming',
  'Logistics',
  'Local MSMEs',
];

export default function CategoryController() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form states
  const [name, setName] = useState('');
  const [vertical, setVertical] = useState('Medical & Healthcare');
  const [layouts, setLayouts] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Alert states
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'info'>('success');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('adgravity_categories');
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      setCategories(DEFAULT_CATEGORIES);
      localStorage.setItem('adgravity_categories', JSON.stringify(DEFAULT_CATEGORIES));
    }
  }, []);

  const triggerAlert = (message: string, type: 'success' | 'info' = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Create or Update
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let updatedList: CategoryItem[] = [];

    if (editingId) {
      // Edit mode
      updatedList = categories.map((cat) => 
        cat.id === editingId 
          ? { ...cat, name: name.trim(), vertical, layouts: layouts.trim() || 'Default Modern Grid' }
          : cat
      );
      triggerAlert('✓ Category updated successfully!');
      setEditingId(null);
    } else {
      // Add mode
      const newId = 'cat_' + Math.random().toString(36).substring(2, 9);
      const newCategory: CategoryItem = {
        id: newId,
        name: name.trim(),
        vertical,
        layouts: layouts.trim() || 'Default Modern Grid',
      };
      updatedList = [newCategory, ...categories];
      triggerAlert('✓ New business category added globally!');
    }

    setCategories(updatedList);
    localStorage.setItem('adgravity_categories', JSON.stringify(updatedList));
    
    // Reset inputs
    setName('');
    setLayouts('');
  };

  // Populate form for Edit
  const handleEditTrigger = (item: CategoryItem) => {
    setEditingId(item.id);
    setName(item.name);
    setVertical(item.vertical);
    setLayouts(item.layouts);
    triggerAlert(`Editing category: ${item.name}`, 'info');
  };

  // Delete category
  const handleDeleteCategory = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the business category "${name}"? This updates the onboarding dropdown instantly.`)) return;

    const updatedList = categories.filter((cat) => cat.id !== id);
    setCategories(updatedList);
    localStorage.setItem('adgravity_categories', JSON.stringify(updatedList));
    triggerAlert('🗑️ Category removed from global directory!');
    
    if (editingId === id) {
      setEditingId(null);
      setName('');
      setLayouts('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setLayouts('');
  };

  // Search filter
  const filteredCategories = categories.filter((cat) => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.vertical.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.layouts.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in w-full">
      {/* Left 4 columns: Category CRUD form */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
          
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{editingId ? '📝 Edit Category Node' : '🏷️ Add Business Category'}</span>
            </h3>
            <p className="text-gray-400 text-xs mt-1">
              {editingId ? 'Modify details of the selected vertical node.' : 'Map new business verticals to customize clients layouts.'}
            </p>
          </div>

          <form onSubmit={handleSaveCategory} className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 font-semibold">Category / Niche Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Organic Tea Vendors"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-2.5 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white font-medium placeholder-gray-600"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 font-semibold">Indian Vertical (Mega-Category)</label>
              <select
                value={vertical}
                onChange={(e) => setVertical(e.target.value)}
                className="px-4 py-2.5 bg-[#0c0f18] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white font-medium"
              >
                {VERTICAL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 font-semibold">Tagged Layout Presets & Templates</label>
              <input 
                type="text" 
                placeholder="e.g. Earth Green, Folk Art Frame"
                value={layouts}
                onChange={(e) => setLayouts(e.target.value)}
                className="px-4 py-2.5 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white font-medium placeholder-gray-600"
              />
              <span className="text-[10px] text-gray-500">Separated by commas. Binds design aesthetics to this category.</span>
            </div>

            <div className="flex gap-3 mt-2">
              <button 
                type="submit" 
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/10"
              >
                {editingId ? 'Update Node' : 'Register Category'}
              </button>
              {editingId && (
                <button 
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {alertMessage && (
            <div className={`p-3 border text-xs rounded-xl text-center font-medium ${
              alertType === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
            }`}>
              {alertMessage}
            </div>
          )}
        </div>
      </div>

      {/* Right 8 columns: Category Directory Table */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Niche & Category Directory</h3>
              <p className="text-gray-400 text-xs mt-1">
                Manage global business category listings dynamically mapped inside onboarding.
              </p>
            </div>
            
            {/* Search Input */}
            <input 
              type="text"
              placeholder="Search category directory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-[#07090e] border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-xs max-w-xs placeholder-gray-650"
            />
          </div>

          {/* Directory Table */}
          <div className="overflow-x-auto border border-white/5 rounded-2xl bg-white/[0.01]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 uppercase tracking-wider font-semibold bg-white/[0.02]">
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Mega-Vertical</th>
                  <th className="p-4">Tagged Layouts</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500 italic">
                      No business categories matched your query.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-bold text-white">{item.name}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold border border-indigo-500/10">
                          {item.vertical}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 max-w-[200px] truncate" title={item.layouts}>
                        {item.layouts}
                      </td>
                      <td className="p-4 text-right flex gap-3 justify-end">
                        <button 
                          onClick={() => handleEditTrigger(item)}
                          className="text-indigo-400 hover:text-indigo-300 font-bold"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(item.id, item.name)}
                          className="text-red-400 hover:text-red-350 font-bold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
            <span>Total Categories: {categories.length} listings</span>
            <span>Dataset Cache: LocalStorage (Synced)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
