import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserProfileById, fetchPosts } from '../utils/api';
import VerifiedBadge from '../components/VerifiedBadge';

function vremeProslo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return date.toLocaleDateString('sr-RS');
}

const OtherProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchUserProfileById(id)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setLoadingPosts(true);
    fetchPosts()
      .then(allPosts => {
        setPosts(allPosts.filter(p => (p.author?._id || p.author?.id) === id));
      })
      .catch(() => setPosts([]))
      .finally(() => setLoadingPosts(false));
  }, [id]);

  if (loading) return <div className="text-center mt-10">Učitavanje profila...</div>;
  if (!profile) return <div className="text-center mt-10 text-red-500">Korisnik nije pronađen.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow p-0 flex flex-col items-center overflow-hidden">
      {/* Profil info */}
      <div className="w-full flex flex-col items-center p-6 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
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
        <h2 className="text-2xl font-bold mb-1 flex items-center">
          {profile.name}
          {profile.role === 'admin' && <VerifiedBadge />}
        </h2>
        <p className="text-gray-600 mb-1">{profile.email}</p>
        <p className="text-gray-700 mb-2 text-center">{profile.description}</p>
        <span className="text-xs text-gray-400 mb-1">Korisnički ID: {profile.id}</span>
        <span className="text-xs text-gray-400 mb-1">Uloga: {profile.role}</span>
      </div>
      {/* Objave korisnika */}
      <div className="w-full px-2 py-6">
        <h3 className="text-lg font-bold mb-4 text-center">Objave korisnika</h3>
        {loadingPosts ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-40" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-400">Ovaj korisnik nema nijednu objavu.</div>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#ef4444"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#ef4444"
                      className="w-7 h-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.014-4.5-4.5-4.5-1.657 0-3.067 1.007-3.708 2.457a.75.75 0 0 1-1.384 0C10.067 4.757 8.657 3.75 7 3.75 4.514 3.75 2.5 5.765 2.5 8.25c0 7.22 9.5 12 9.5 12s9.5-4.78 9.5-12z"
                      />
                    </svg>
                    {post.likes.length}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#3b82f6"
                      className="w-7 h-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 15.75a2.25 2.25 0 0 1-2.25 2.25H6l-4.5 4.5V6.75A2.25 2.25 0 0 1 3.75 4.5h15.75a2.25 2.25 0 0 1 2.25 2.25v9z"
                      />
                    </svg>
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
    </div>
  );
};

export default OtherProfilePage;