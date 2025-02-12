"use client";

import { useAuth } from "@/components/AuthProvider";

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Ensure this runs properly
  };

  return (
    <button
      onClick={handleLogout}
      className=""
    >
      Logout
    </button>
  );
}
