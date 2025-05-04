import React from 'react';
import { useAuth } from '../hooks/AuthContext';
import UserProfile from '../components/Profile/UserProfile';

const ProfilePage = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Nema korisnika tek kad loading bude false
  if (!user) {
    return (
      <div className="text-center mt-10 text-red-500">
        Morate biti prijavljeni da biste videli profil.
      </div>
    );
  }

  return <UserProfile />;
};

export default ProfilePage;