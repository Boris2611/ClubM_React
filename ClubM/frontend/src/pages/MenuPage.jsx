import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { fetchMenuItems, createMenuItem, deleteMenuItem, updateMenuItem } from '../utils/api';

const CATEGORIES = [
  { value: 'kafa', label: 'Kafa' },
  { value: 'caj', label: 'Čaj' },
  { value: 'pivo', label: 'Pivo' },
  { value: 'zestina', label: 'Žestina' },
  { value: 'vino', label: 'Vino' },
  { value: 'sokovi', label: 'Sokovi' },
  { value: 'voda', label: 'Voda' },
  { value: 'ostalo', label: 'Ostalo' }
];

const MenuPage = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Edit modal state
  const [editModal, setEditModal] = useState({ open: false, item: null, name: '', description: '', price: '', category: '', image: '', imageFile: null });

  const loadMenu = async () => {
    setLoading(true);
    try {
      const data = await fetchMenuItems();
      setMenuItems(data);
    } catch (err) {
      setError('Greška pri učitavanju menija');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMenu(); }, []);

  // Dodaj novi proizvod (samo admin)
  const handleAdd = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      if (imageFile) formData.append('image', imageFile);
      await createMenuItem(formData);
      setForm({ name: '', description: '', price: '', category: '' });
      setImageFile(null);
      loadMenu();
    } catch (err) {
      setError('Greška pri dodavanju proizvoda');
    }
    setIsSubmitting(false);
  };

  // Obrisi proizvod (samo admin)
  const handleDelete = async (id) => {
    if (!window.confirm('Obrisati proizvod?')) return;
    try {
      await deleteMenuItem(id);
      loadMenu();
    } catch {
      setError('Greška pri brisanju proizvoda');
    }
  };

  // Otvori modal za izmenu
  const openEditModal = (item) => {
    setEditModal({
      open: true,
      item,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      imageFile: null
    });
  };

  // Sačuvaj izmenu proizvoda
  const handleEditSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', editModal.name);
      formData.append('description', editModal.description);
      formData.append('price', editModal.price);
      formData.append('category', editModal.category);
      if (editModal.imageFile) formData.append('image', editModal.imageFile);
      else formData.append('image', editModal.image);
      await updateMenuItem(editModal.item._id, formData);
      setEditModal({ open: false, item: null, name: '', description: '', price: '', category: '', image: '', imageFile: null });
      loadMenu();
    } catch (err) {
      setError('Greška pri izmeni proizvoda');
    }
    setIsSubmitting(false);
  };

  // Filtriraj po nazivu i kategoriji (ispravljeno: backend šalje category kao string, frontend filter poredi stringove)
  const filtered = menuItems.filter(item =>
    item.name?.toLowerCase().includes(filter.toLowerCase()) &&
    (categoryFilter === '' || (item.category && item.category.toLowerCase() === categoryFilter.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Meni pića</h1>
      {/* Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-2 items-center">
        <input
          type="text"
          placeholder="Pretraži po nazivu..."
          className="border border-gray-200 rounded px-3 py-2 flex-1"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <select
          className="border border-gray-200 rounded px-3 py-2"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">Sve kategorije</option>
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>
      {/* Admin forma za dodavanje */}
      {user?.role === 'admin' && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl shadow p-4 mb-8 flex flex-col gap-3" encType="multipart/form-data">
          <h2 className="text-xl font-semibold mb-2">Dodaj novo piće</h2>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <input
            type="text"
            placeholder="Naziv pića"
            className="border border-gray-200 rounded px-3 py-2"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <textarea
            placeholder="Opis"
            className="border border-gray-200 rounded px-3 py-2"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            required
          />
          <input
            type="number"
            placeholder="Cena (RSD)"
            className="border border-gray-200 rounded px-3 py-2"
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            required
            min={1}
          />
          <select
            className="border border-gray-200 rounded px-3 py-2"
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            required
          >
            <option value="">Izaberi kategoriju</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            className="border border-gray-200 rounded px-3 py-2"
            onChange={e => setImageFile(e.target.files[0])}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-6 py-2 font-semibold hover:bg-blue-700 transition self-end"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Dodavanje...' : 'Dodaj piće'}
          </button>
        </form>
      )}
      {/* Lista pića */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center text-gray-400">Učitavanje...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400">Nema pića za prikaz.</div>
        ) : (
          filtered.map(item => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col sm:flex-row group"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-40 w-full sm:w-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-1 text-gray-900">{item.name}</h3>
                <p className="text-gray-500 flex-1">{item.description}</p>
                <div className="mt-2 text-base font-bold text-gray-800">{item.price} RSD</div>
                <div className="text-xs text-gray-400 mt-1">Kategorija: {CATEGORIES.find(c => c.value === item.category)?.label || item.category}</div>
                {user?.role === 'admin' && (
                  <div className="flex gap-2 mt-2 self-end">
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Izmeni
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Obriši
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Modal za izmenu */}
      {editModal.open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <form
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs flex flex-col gap-3 relative"
            onSubmit={handleEditSave}
            encType="multipart/form-data"
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setEditModal({ open: false, item: null, name: '', description: '', price: '', category: '', image: '', imageFile: null })}
              type="button"
              title="Zatvori"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2">Izmeni piće</h3>
            <input
              type="text"
              className="border border-gray-200 rounded p-2"
              value={editModal.name}
              onChange={e => setEditModal(m => ({ ...m, name: e.target.value }))}
              required
            />
            <textarea
              className="border border-gray-200 rounded p-2"
              value={editModal.description}
              onChange={e => setEditModal(m => ({ ...m, description: e.target.value }))}
              rows={3}
              required
            />
            <input
              type="number"
              className="border border-gray-200 rounded p-2"
              value={editModal.price}
              onChange={e => setEditModal(m => ({ ...m, price: e.target.value }))}
              required
              min={1}
            />
            <select
              className="border border-gray-200 rounded p-2"
              value={editModal.category}
              onChange={e => setEditModal(m => ({ ...m, category: e.target.value }))}
              required
            >
              <option value="">Izaberi kategoriju</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <input
              type="file"
              accept="image/*"
              className="border border-gray-200 rounded p-2"
              onChange={e => setEditModal(m => ({ ...m, imageFile: e.target.files[0] }))}
            />
            <button
              className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition"
              type="submit"
              disabled={isSubmitting}
            >
              Sačuvaj izmene
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MenuPage;