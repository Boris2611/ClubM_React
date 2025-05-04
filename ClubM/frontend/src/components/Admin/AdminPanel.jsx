import React, { useEffect, useState } from 'react';
import { fetchPosts, fetchMenuItems, fetchAdminData } from '../../utils/api';

const AdminPanel = () => {
    const [posts, setPosts] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedPosts = await fetchPosts();
            const fetchedMenuItems = await fetchMenuItems();
            const fetchedUsers = await fetchAdminData();

            setPosts(fetchedPosts);
            setMenuItems(fetchedMenuItems);
            setUsers(fetchedUsers);
        };

        fetchData();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
            <section className="mb-8">
                <h2 className="text-xl font-semibold">Posts</h2>
                <ul>
                    {posts.map(post => (
                        <li key={post._id} className="border-b py-2">
                            {post.description}
                        </li>
                    ))}
                </ul>
            </section>
            <section className="mb-8">
                <h2 className="text-xl font-semibold">Menu Items</h2>
                <ul>
                    {menuItems.map(item => (
                        <li key={item._id} className="border-b py-2">
                            {item.name} - ${item.price}
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2 className="text-xl font-semibold">Users</h2>
                <ul>
                    {users.map(user => (
                        <li key={user._id} className="border-b py-2">
                            {user.name} - {user.email}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default AdminPanel;