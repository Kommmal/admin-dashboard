"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

interface User {
  name: string;
  email: string;
  image: string;
}

export default function UserSettings({ user }: { user: User }) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="relative">
      <img
        src={user.image || "/default-avatar.png"}
        alt="User"
        className="w-12 h-12 rounded-full cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      />
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg text-black rounded-lg">
          <button onClick={() => setShowModal(true)} className="block w-full px-4 py-2 text-left hover:bg-gray-200">
            Manage Profile
          </button>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full px-4 py-2 text-left hover:bg-red-500 hover:text-white">
            Logout
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Manage Profile</h2>
            <input type="text" placeholder="Update Name" className="w-full p-2 border rounded mb-2" />
            <input type="password" placeholder="New Password" className="w-full p-2 border rounded mb-2" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Save Changes</button>
            <button onClick={() => setShowModal(false)} className="mt-2 text-red-500">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
