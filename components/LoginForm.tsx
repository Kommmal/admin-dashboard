"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md lg:w-[30%] md:w-[50%] w-[90%]">
      <h2 className="text-2xl font-semibold mb-4 text-center">Admin Login</h2>
      {error && <p className="text-red-500 text-center mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          required
        />
        <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
          Login
        </button>
      </form>
    </div>
  );
}
