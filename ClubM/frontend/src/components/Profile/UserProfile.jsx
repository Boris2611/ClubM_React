import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../hooks/AuthContext';
import VerifiedBadge from '../VerifiedBadge';
import { fetchUserProfile, updateUserProfile, fetchPosts, updatePost, deletePost } from '../../utils/api';

const ProfileSkeleton = () => (
  <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow p-6 flex flex-col items-center animate-pulse">
    <div className="w-24 h-24 rounded-full bg-gray-200 mb-4" />
    <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
    <div className="h-4 bg-gray-100 rounded w-40 mb-4"></div>
    <div className="h-4 bg-gray-100 rounded w-24 mb-2"></div>
  </div>
);

function vremeProslo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return date.toLocaleDateString('sr-RS');
}

const DotsIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={filled ? "#ef4444" : "none"}
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="#ef4444"
    className={`w-7 h-7 transition-all duration-150 ${filled ? 'scale-110' : ''}`}
    style={{ cursor: 'pointer' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.014-4.5-4.5-4.5-1.657 0-3.067 1.007-3.708 2.457a.75.75 0 0 1-1.384 0C10.067 4.757 8.657 3.75 7 3.75 4.514 3.75 2.5 5.765 2.5 8.25c0 7.22 9.5 12 9.5 12s9.5-4.78 9.5-12z"
    />
  </svg>
);

const CommentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="#3b82f6"
    className="w-7 h-7"
    style={{ cursor: 'pointer' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 15.75a2.25 2.25 0 0 1-2.25 2.25H6l-4.5 4.5V6.75A2.25 2.25 0 0 1 3.75 4.5h15.75a2.25 2.25 0 0 1 2.25 2.25v9z"
    />
  </svg>
);

const UserProfile = () => {
  const { user, logout, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();
  const [editProfile, setEditProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editModal, setEditModal] = useState({ open: false, post: null, description: '', image: '' });
  const [menuOpen, setMenuOpen] = useState({});

  useEffect(() => {
    setLoadingProfile(true);
    fetchUserProfile()
      .then(data => {
        setProfile(data);
        setEditName(data.name);
        setEditDesc(data.description || '');
      })
      .finally(() => setLoadingProfile(false));
  }, [user]);

  useEffect(() => {
    setLoadingPosts(true);
    fetchPosts()
      .then(allPosts => {
        setPosts(allPosts.filter(p => (p.author?._id || p.author?.id) === (user?.id || user?._id)));
      })
      .finally(() => setLoadingPosts(false));
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  // MODAL avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setShowAvatarModal(true);
    }
  };

  const handleAvatarUpload = async () => {
    if (!fileInputRef.current.files[0]) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('avatar', fileInputRef.current.files[0]);
    try {
      const data = await updateUserProfile(formData);
      setProfile(p => ({ ...p, avatar: data.avatar }));
      setUser(u => ({ ...u, avatar: data.avatar }));
      setShowAvatarModal(false);
      setPreview(null);
    } catch {
      alert('Greška pri uploadu slike');
    }
    setIsUploading(false);
  };

  const handleProfileSave = async () => {
    setIsUploading(true);
    try {
      const data = await updateUserProfile({ name: editName, description: editDesc });
      setProfile(p => ({ ...p, name: data.name, description: data.description }));
      setUser(u => ({ ...u, name: data.name, description: data.description }));
      setEditProfile(false);
    } catch {
      alert('Greška pri izmeni profila');
    }
    setIsUploading(false);
  };

  const toggleMenu = (postId) => {
    setMenuOpen((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovu objavu?')) return;
    try {
      await deletePost(postId);
      setPosts(posts => posts.filter(p => p._id !== postId));
    } catch {
      alert('Greška pri brisanju objave');
    }
  };

  const openEditModal = (post) => {
    setEditModal({ open: true, post, description: post.description, image: post.image });
    setMenuOpen({});
  };

  const closeEditModal = () => {
    setEditModal({ open: false, post: null, description: '', image: '' });
  };

  const handleEditSave = async () => {
    try {
      await updatePost(editModal.post._id, {
        description: editModal.description,
        image: editModal.image,
      });
      setPosts(posts =>
        posts.map(p =>
          p._id === editModal.post._id
            ? { ...p, description: editModal.description, image: editModal.image }
            : p
        )
      );
      closeEditModal();
    } catch {
      alert('Greška pri izmeni objave');
    }
  };

  if (!user) return null;
  if (loadingProfile) return <ProfileSkeleton />;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow p-0 flex flex-col items-center overflow-hidden">
      <div className="w-full flex flex-col items-center p-6 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="relative">
          <img
            src={
              profile.avatar && profile.avatar !== 'default-avatar.png'
                ? profile.avatar.startsWith('/uploads')
                  ? profile.avatar
                  : `/uploads/${profile.avatar}`
                : '/default-avatar.png'
            }
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow mb-2"
          />
          <button
            className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-1 shadow hover:bg-blue-700 transition"
            onClick={() => fileInputRef.current.click()}
            title="Promeni avatar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15.232 5.232l3.536 3.536M9 13l6-6M3 21h18" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <h2 className="text-2xl font-bold mb-1 flex items-center justify-center">
          {profile.name}
          {profile.role === 'admin' && <VerifiedBadge />}
        </h2>
        <p className="text-gray-600 mb-1">{profile.email}</p>
        <p className="text-gray-700 mb-2 text-center">{profile.description}</p>
        <span className="text-xs text-gray-400 mb-1">Korisnički ID: {profile.id}</span>
        <span className="text-xs text-gray-400 mb-1">Uloga: {profile.role}</span>
        <div className="flex gap-2 mt-3">
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
            onClick={() => setEditProfile(true)}
          >
            Izmeni profil
          </button>
          <button
            className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300 transition"
            onClick={handleLogout}
          >
            Odjavi se
          </button>
        </div>
      </div>
      {/* Modal za izmenu profila */}
      {editProfile && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs flex flex-col gap-3 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setEditProfile(false)}
              title="Zatvori"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2">Izmeni profil</h3>
            <input
              type="text"
              className="border border-gray-200 rounded p-2"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              required
            />
            <textarea
              className="border border-gray-200 rounded p-2"
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              rows={3}
              placeholder="Opis (opciono)"
            />
            <button
              className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition"
              onClick={handleProfileSave}
              disabled={isUploading}
            >
              Sačuvaj izmene
            </button>
          </div>
        </div>
      )}
      {/* Modal za avatar upload */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs flex flex-col gap-3 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => { setShowAvatarModal(false); setPreview(null); }}
              title="Zatvori"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2">Promeni avatar</h3>
            {preview && (
              <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover mx-auto mb-2" />
            )}
            <button
              className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition"
              onClick={handleAvatarUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Upload...' : 'Sačuvaj'}
            </button>
          </div>
        </div>
      )}
      {/* Objave korisnika */}
      <div className="w-full px-2 py-6">
        <h3 className="text-lg font-bold mb-4 text-center">Moje objave</h3>
        {loadingPosts ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-40" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-400">Nemate nijednu objavu.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map(post => (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow flex flex-col border border-gray-100 relative"
                style={{ width: 350, minHeight: 500, margin: '0 auto' }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 px-4 pt-4 pb-2 relative">
                  <img
                    src={profile.avatar || '/default-avatar.png'}
                    alt={profile.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold text-gray-900 flex items-center">
                      {profile.name}
                      {profile.role === 'admin' && <VerifiedBadge />}
                    </span>
                    <span className="text-xs text-gray-400">{vremeProslo(post.createdAt)}</span>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => toggleMenu(post._id)}
                      className="p-1 rounded-full hover:bg-gray-100 transition"
                      title="Opcije"
                    >
                      <DotsIcon />
                    </button>
                    {menuOpen[post._id] && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border rounded-xl shadow z-20 overflow-hidden">
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-blue-50 transition"
                          onClick={() => openEditModal(post)}
                        >
                          <span className="text-blue-700 font-semibold">Izmeni</span>
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                          onClick={() => handleDelete(post._id)}
                        >
                          Obriši
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Slika */}
                <div className="w-full h-[350px] bg-gray-100 flex items-center justify-center">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title || post.description}
                      className="object-cover w-full h-full"
                      style={{ maxHeight: 350, minHeight: 350, minWidth: 350, maxWidth: 350 }}
                    />
                  ) : (
                    <div className="text-gray-300 text-3xl">Bez slike</div>
                  )}
                </div>
                {/* Like & Comment bar */}
                <div className="flex items-center gap-6 px-4 pt-3 pb-1">
                  <span className="flex items-center gap-1 text-gray-500">
                    <HeartIcon filled={false} />
                    {post.likes.length}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <CommentIcon />
                    {post.comments.length}
                  </span>
                </div>
                {/* Opis */}
                <div className="px-4 py-2 flex flex-col gap-2">
                  <p className="text-gray-900">{post.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal za izmenu objave */}
      {editModal.open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs flex flex-col gap-3 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={closeEditModal}
              title="Zatvori"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2">Izmeni objavu</h3>
            <textarea
              className="border border-gray-200 rounded p-2"
              value={editModal.description}
              onChange={e => setEditModal(modal => ({ ...modal, description: e.target.value }))}
              rows={3}
            />
            <input
              type="text"
              className="border border-gray-200 rounded p-2"
              value={editModal.image}
              onChange={e => setEditModal(modal => ({ ...modal, image: e.target.value }))}
              placeholder="URL slike (opciono)"
            />
            <button
              className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition"
              onClick={handleEditSave}
            >
              Sačuvaj izmene
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;