import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import api, { deletePost, updatePost, likePost } from '../../utils/api';
import VerifiedBadge from '../VerifiedBadge';

// Loader skeleton za feed
const FeedSkeleton = () => (
  <div
    className="animate-pulse bg-white rounded-2xl shadow flex flex-col overflow-hidden max-w-md mx-auto border border-gray-100"
    style={{ width: 350, minHeight: 500 }}
  >
    <div className="flex items-center gap-3 px-4 pt-4 pb-2">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
        <div className="h-3 bg-gray-100 rounded w-16"></div>
      </div>
    </div>
    <div className="w-full h-[350px] bg-gray-200 flex items-center justify-center" />
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
    </div>
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

const HeartIcon = ({ filled, animate }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={filled ? "#ef4444" : "none"}
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="#ef4444"
    className={`w-7 h-7 transition-all duration-200 ${filled ? 'scale-125 drop-shadow-lg' : ''} ${animate ? 'animate-like-pop' : ''}`}
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

const DotsIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-7 h-7 text-red-500 hover:text-red-700 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
  </svg>
);

const FeedList = ({ posts, loading }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState({});
  const [showCommentBox, setShowCommentBox] = useState({});
  const [showAllComments, setShowAllComments] = useState({});
  const [menuOpen, setMenuOpen] = useState({});
  const [editModal, setEditModal] = useState({ open: false, post: null, description: '', image: '' });
  const [localPosts, setLocalPosts] = useState(posts);
  const [likeAnim, setLikeAnim] = useState({}); // { [postId]: true/false }

  // Sync localPosts with props samo na prvo učitavanje
  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  // Like handler bez refresh-a i sa animacijom
  const handleLike = async (postId) => {
    if (!user) return;
    setLocalPosts(prev =>
      prev.map(post =>
        post._id === postId
          ? {
              ...post,
              likes: post.likes.includes(user.id || user._id)
                ? post.likes.filter(uid => uid !== (user.id || user._id))
                : [...post.likes, user.id || user._id]
            }
          : post
      )
    );
    setLikeAnim(anim => ({ ...anim, [postId]: true }));
    setTimeout(() => setLikeAnim(anim => ({ ...anim, [postId]: false })), 350);

    try {
      await likePost(postId);
      // Nema više refresh()
    } catch (err) {
      // Optionally revert like on error
    }
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]) return;
    // Optimistički update komentara
    setLocalPosts(prev =>
      prev.map(post =>
        post._id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  user: {
                    name: user.name,
                    avatar: user.avatar,
                    role: user.role,
                  },
                  text: commentText[postId],
                },
              ],
            }
          : post
      )
    );
    setCommentText({ ...commentText, [postId]: '' });
    try {
      await api.post(`/feed/${postId}/comment`, { comment: commentText[postId] });
      // Nema više refresh()
    } catch (err) {
      // Optionally revert comment on error
    }
  };

  const toggleCommentBox = (postId) => {
    setShowCommentBox((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleAllComments = (postId) => {
    setShowAllComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleMenu = (postId) => {
    setMenuOpen((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovu objavu?')) return;
    setLocalPosts(prev => prev.filter(post => post._id !== postId));
    try {
      await deletePost(postId);
    } catch (err) {
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
      setLocalPosts(prev =>
        prev.map(post =>
          post._id === editModal.post._id
            ? { ...post, description: editModal.description, image: editModal.image }
            : post
        )
      );
      closeEditModal();
    } catch (err) {
      alert('Greška pri izmeni objave');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8 text-gray-900 tracking-tight text-center">Objave</h2>
      <div className="flex flex-col gap-10">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <FeedSkeleton key={i} />)
          : localPosts.length > 0
          ? localPosts.map(post => {
              const liked = user && post.likes.includes(user.id || user._id);
              const sviKomentari = showAllComments[post._id] ? post.comments : post.comments.slice(-2);
              const isAuthor = user && (user.id === post.author?._id || user._id === post.author?._id);
              const isAdmin = user && user.role === 'admin';

              return (
                <div
                  key={post._id}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-200 overflow-hidden flex flex-col max-w-md mx-auto border border-gray-100"
                  style={{ width: 370, minHeight: 520 }}
                >
                  {/* Header: Avatar, Ime (link), vreme, meni */}
                  <div className="flex items-center gap-3 px-5 pt-5 pb-2 relative">
                    <Link to={`/user/${post.author?._id || post.author?.id}`}>
                      <img
                        src={post.author?.avatar?.startsWith('/uploads') ? post.author.avatar : (post.author?.avatar || '/default-avatar.png')}
                        alt={post.author?.name || 'Korisnik'}
                        className="w-11 h-11 rounded-full object-cover border-2 border-blue-100 shadow-sm hover:scale-105 transition"
                      />
                    </Link>
                    <div className="flex flex-col flex-1">
                      <Link
                        to={`/user/${post.author?._id || post.author?.id}`}
                        className="font-semibold text-gray-900 hover:text-blue-600 hover:underline transition flex items-center"
                      >
                        {post.author?.name || 'Korisnik'}
                        {post.author?.role === 'admin' && <VerifiedBadge />}
                      </Link>
                      <span className="text-xs text-gray-400">{vremeProslo(post.createdAt)}</span>
                    </div>
                    {isAuthor ? (
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
                    ) : isAdmin ? (
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="p-1 rounded-full hover:bg-red-100 transition"
                        title="Obriši objavu kao admin"
                      >
                        <TrashIcon />
                      </button>
                    ) : null}
                  </div>
                  {/* Slika */}
                  <div className="w-full h-[350px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title || post.description}
                        className="object-cover w-full h-full rounded-none"
                        style={{ maxHeight: 350, minHeight: 350, minWidth: 370, maxWidth: 370 }}
                      />
                    ) : (
                      <div className="text-gray-300 text-3xl font-bold">Bez slike</div>
                    )}
                  </div>
                  {/* Like & Comment bar */}
                  <div className="flex items-center gap-8 px-5 pt-4 pb-1 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleLike(post._id)}
                      className="focus:outline-none flex items-center group"
                      title="Sviđa mi se"
                    >
                      <HeartIcon filled={liked} animate={likeAnim[post._id]} />
                      <span className="ml-1 text-gray-700 group-hover:text-red-500 font-medium">{post.likes.length}</span>
                    </button>
                    <button
                      onClick={() => toggleCommentBox(post._id)}
                      className="focus:outline-none flex items-center group"
                      title="Komentariši"
                    >
                      <CommentIcon />
                      <span className="ml-1 text-gray-700 group-hover:text-blue-500 font-medium">{post.comments.length}</span>
                    </button>
                  </div>
                  {/* Opis */}
                  <div className="px-5 py-3 flex flex-col gap-2">
                    <p className="text-gray-900 text-base leading-relaxed">{post.description}</p>
                    {/* Polje za komentar */}
                    {user && showCommentBox[post._id] && (
                      <div className="flex items-center gap-2 border-t pt-3 mt-2">
                        <img
                          src={user.avatar?.startsWith('/uploads') ? user.avatar : (user.avatar || '/default-avatar.png')}
                          alt={user.name || 'Korisnik'}
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                        <input
                          type="text"
                          value={commentText[post._id] || ''}
                          onChange={e => setCommentText({ ...commentText, [post._id]: e.target.value })}
                          placeholder="Dodaj komentar..."
                          className="border rounded-full px-4 py-1 flex-1 focus:outline-none bg-gray-50"
                        />
                        <button
                          onClick={() => handleComment(post._id)}
                          className="text-blue-600 font-semibold hover:text-blue-800 transition px-3 py-1 rounded"
                        >
                          Objavi
                        </button>
                      </div>
                    )}
                    {/* Komentari */}
                    <div className="mt-2 flex flex-col gap-2">
                      {post.comments.length > 2 && !showAllComments[post._id] && (
                        <span
                          className="text-xs text-blue-500 cursor-pointer hover:underline"
                          onClick={() => toggleAllComments(post._id)}
                        >
                          Prikaži sve komentare ({post.comments.length})
                        </span>
                      )}
                      {(showAllComments[post._id] ? post.comments : post.comments.slice(-2)).map((c, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <img
                            src={c.user?.avatar?.startsWith('/uploads') ? c.user.avatar : (c.user?.avatar || '/default-avatar.png')}
                            alt={c.user?.name || 'Korisnik'}
                            className="w-6 h-6 rounded-full object-cover border"
                          />
                          <b className="mr-1 text-gray-900 flex items-center">
                            {c.user?.name || 'Korisnik'}
                            {c.user?.role === 'admin' && <VerifiedBadge />}
                          </b>
                          <span>{c.text}</span>
                        </div>
                      ))}
                      {post.comments.length > 2 && showAllComments[post._id] && (
                        <span
                          className="text-xs text-blue-500 cursor-pointer hover:underline"
                          onClick={() => toggleAllComments(post._id)}
                        >
                          Sakrij komentare
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          : <FeedSkeleton />}
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

export default FeedList;