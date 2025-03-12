'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ 
      redirect: true,
      callbackUrl: '/auth/signin'
    });
  };

  return (
    <button 
      onClick={handleLogout}
      className="btn btn-ghost btn-sm normal-case"
    >
      Sign out
    </button>
  );
}