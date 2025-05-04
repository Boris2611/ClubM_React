import React, { useState } from 'react';
import { useAuth } from '../../hooks/AuthContext';
import { createRentalItem, updateRentalItem, deleteRentalItem } from '../../utils/api';

const RentalsList = ({ rentals = [], loading, refresh }) => {
  const { user } = useAuth();
  const [editModal, setEditModal] = useState({ open: false, item: null, name: '', description: '', price: '', image: '', imageFile: null });
  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', description: '', price: '', imageFile: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Otvori modal za izmenu
  const openEditModal = (item) => {
    setEditModal({
      open: true,
      item,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      imageFile: null
    });
  };

  // Sačuvaj izmenu proizvoda
  const handleEditSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', editModal.name);
      formData.append('description', editModal.description);
      formData.append('price', editModal.price);
      if (editModal.imageFile) formData.append('image', editModal.imageFile);
      else formData.append('image', editModal.image);
      await updateRentalItem(editModal.item._id, formData);
      setEditModal({ open: false, item: null, name: '', description: '', price: '', image: '', imageFile: null });
      refresh && refresh();
    } catch (err) {
      alert('Greška pri izmeni proizvoda');
    }
    setIsSubmitting(false);
  };

  // Dodaj novi proizvod
  const handleAddSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', addForm.name);
      formData.append('description', addForm.description);
      formData.append('price', addForm.price);
      if (addForm.imageFile) formData.append('image', addForm.imageFile);
      await createRentalItem(formData);
      setAddForm({ name: '', description: '', price: '', imageFile: null });
      setAddModal(false);
      refresh && refresh();
    } catch (err) {
      alert('Greška pri dodavanju proizvoda');
    }
    setIsSubmitting(false);
  };

  // Obrisi proizvod (samo admin)
  const handleDelete = async (id) => {
    if (!window.confirm('Obrisati proizvod?')) return;
    try {
      await deleteRentalItem(id);
      refresh && refresh();
    } catch {
      alert('Greška pri brisanju proizvoda');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Iznajmi:</h2>
        {user?.role === 'admin' && (
          <button
            className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition"
            onClick={() => setAddModal(true)}
          >
            + Dodaj proizvod
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl shadow flex flex-col overflow-hidden">
                <div className="bg-gray-200 h-40 w-full" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            ))
          : rentals.map(rental => (
              <div key={rental._id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                {rental.image && (
                  <img src={rental.image} alt={rental.name} className="h-40 w-full object-cover" />
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold mb-1">{rental.name}</h3>
                  <p className="text-gray-600 flex-1">{rental.description}</p>
                  <div className="mt-2 text-lg font-bold text-green-600">{rental.price} RSD</div>
                  {user?.role === 'admin' && (
                    <div className="flex gap-2 mt-2 self-end">
                      <button
                        onClick={() => openEditModal(rental)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Izmeni
                      </button>
                      <button
                        onClick={() => handleDelete(rental._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Obriši
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
      </div>
      {/* Modal za dodavanje */}
      {addModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <form
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs flex flex-col gap-3 relative"
            onSubmit={handleAddSave}
            encType="multipart/form-data"
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setAddModal(false)}
              type="button"
              title="Zatvori"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2">Dodaj proizvod</h3>
            <input
              type="text"
              className="border border-gray-200 rounded p-2"
              value={addForm.name}
              onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Naziv"
              required
            />
            <textarea
              className="border border-gray-200 rounded p-2"
              value={addForm.description}
              onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Opis"
              rows={3}
              required
            />
            <input
              type="number"
              className="border border-gray-200 rounded p-2"
              value={addForm.price}
              onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))}
              placeholder="Cena"
              required
              min={1}
            />
            <input
              type="file"
              accept="image/*"
              className="border border-gray-200 rounded p-2"
              onChange={e => setAddForm(f => ({ ...f, imageFile: e.target.files[0] }))}
              required
            />
            <button
              className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition"
              type="submit"
              disabled={isSubmitting}
            >
              Sačuvaj
            </button>
          </form>
        </div>
      )}
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
              onClick={() => setEditModal({ open: false, item: null, name: '', description: '', price: '', image: '', imageFile: null })}
              type="button"
              title="Zatvori"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2">Izmeni proizvod</h3>
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

export default RentalsList;