import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import FeedPage from './pages/FeedPage';
import MenuPage from './pages/MenuPage';
import ShopPage from './pages/ShopPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OtherProfilePage from './pages/OtherProfilePage';
import { useAuth } from './hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createPost } from './utils/api';

// PrivateRoute za React Router v6
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

const icons = {
  home: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M3 12l9-8 9 8M4 10v10a2 2 0 002 2h3.5a2 2 0 002-2v-4h2v4a2 2 0 002 2H20a2 2 0 002-2V10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  menu: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 12h8M12 8v8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  shop: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M3 7l1.5 12A2 2 0 006.5 21h11a2 2 0 002-2l1.5-12M5 7V5a2 2 0 012-2h10a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  profile: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 20v-2a6 6 0 0112 0v2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  add: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  login: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M15 12H3m0 0l4-4m-4 4l4 4m13-4a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  register: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const navLinks = [
  { to: '/', icon: icons.home, label: 'Početna' },
  { to: '/menu', icon: icons.menu, label: 'Meni' },
  { to: '/shop', icon: icons.shop, label: 'Shop' },
];

const AppContent = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Top nav (desktop) */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm hidden md:flex">
        <div className="max-w-3xl mx-auto flex justify-between items-center px-4 py-2 w-full">
          <div className="flex gap-8">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `group flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow'
                      : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                  }`
                }
                end={link.to === '/'}
              >
                {link.icon}
                <span className="text-xs mt-1 font-medium tracking-wide">{link.label}</span>
              </NavLink>
            ))}
            {user && (
              <NavLink
                to="/add-post"
                className={({ isActive }) =>
                  `group flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow'
                      : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                  }`
                }
              >
                {icons.add}
                <span className="text-xs mt-1 font-medium tracking-wide">Nova objava</span>
              </NavLink>
            )}
          </div>
          <div className="flex gap-4 items-center">
            {user ? (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `group flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow'
                      : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                  }`
                }
              >
                {icons.profile}
                <span className="text-xs mt-1 font-medium tracking-wide">Profil</span>
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `group flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow'
                        : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                    }`
                  }
                >
                  {icons.login}
                  <span className="text-xs mt-1 font-medium tracking-wide">Prijava</span>
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `group flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow'
                        : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                    }`
                  }
                >
                  {icons.register}
                  <span className="text-xs mt-1 font-medium tracking-wide">Registracija</span>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
      {/* Bottom nav (mobile) */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 z-40 shadow-lg">
        <div className="flex justify-around items-center py-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                }`
              }
              end={link.to === '/'}
            >
              {link.icon}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/add-post"
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                }`
              }
            >
              {icons.add}
            </NavLink>
          )}
          {user ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                }`
              }
            >
              {icons.profile}
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex flex-col items-center p-2 rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow'
                      : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                  }`
                }
              >
                {icons.login}
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `flex flex-col items-center p-2 rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow'
                      : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                  }`
                }
              >
                {icons.register}
              </NavLink>
            </>
          )}
        </div>
      </nav>
      <main className="flex-1 max-w-4xl mx-auto w-full pt-6 pb-20 md:pb-0 px-2">
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="/user/:id" element={<OtherProfilePage />} />
          <Route
            path="/add-post"
            element={
              <PrivateRoute>
                <AddPostPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};

// Nova stranica za dodavanje objave (samo za ulogovane)
const AddPostPage = () => {
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState('');
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);
    try {
      if (!description.trim()) {
        setError('Opis je obavezan.');
        setIsUploading(false);
        return;
      }
      if (file) {
        const formData = new FormData();
        formData.append('description', description);
        formData.append('image', file);
        await createPost(formData);
      } else if (image) {
        await createPost({ description, image });
      } else {
        await createPost({ description });
      }
      setDescription('');
      setImage('');
      setFile(null);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Greška pri kreiranju objave');
    }
    setIsUploading(false);
  };

  return (
    <div className="container mx-auto p-2 md:p-4 max-w-lg">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight mb-1 font-pacifico">Nova objava</h1>
        <p className="text-gray-500 text-lg">Podeli nešto sa ClubM zajednicom</p>
      </div>
      <form onSubmit={handleCreatePost} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 relative">
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <textarea
          className="border border-gray-200 rounded p-2"
          placeholder="Šta ima novo?"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          disabled={isUploading}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            setFile(e.target.files[0]);
            setImage('');
          }}
          disabled={isUploading}
        />
        <div className="flex gap-2 items-center">
          <span className="text-gray-400 text-xs">ili</span>
          <input
            type="text"
            className="border border-gray-200 rounded p-2 flex-1"
            placeholder="URL slike (opciono)"
            value={image}
            onChange={e => {
              setImage(e.target.value);
              setFile(null);
            }}
            disabled={!!file || isUploading}
          />
        </div>
        <button
          type="submit"
          className="self-end bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-800 transition flex items-center gap-2"
          disabled={isUploading}
        >
          {isUploading ? 'Postujem...' : 'Objavi'}
        </button>
        {isUploading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span className="text-blue-600 font-semibold">Slika se uploaduje...</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AppContent;