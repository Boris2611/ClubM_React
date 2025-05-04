import React, { useEffect, useState } from 'react';
import FeedList from '../components/Feed/FeedList';
import { useAuth } from '../hooks/AuthContext';
import api from '../utils/api';

function isValidImageUrl(url) {
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
}

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuth();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/feed');
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            setError('Failed to load feed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="container mx-auto p-2 md:p-4">
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight mb-1 font-pacifico">ClubM</h1>
                <p className="text-gray-500 text-lg">Dobrodošli u ClubM feed</p>
            </div>
            <FeedList posts={posts} loading={loading} refresh={fetchPosts} />
        </div>
    );
};

export default FeedPage;