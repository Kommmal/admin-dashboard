'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import logo from "@/src/assests/images/Logo.png";


const SignIn = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);
  };

  return (
    <div className="flex ">
      {/* Left Section: Welcome Message */}
      <div className="min-h-screen flex flex-col  justify-center w-full lg:w-1/2 bg-gray-100 px-6 py-10">
        <h2 className="mt-4 text-3xl font-semibold">Sign In</h2>
        
        <div className="my-6 w-full max-w-md border-b border-gray-300 text-center relative">
          <span className="bg-gray-100 px-2 text-gray-500 absolute -top-3 left-1/2 transform -translate-x-1/2"></span>
        </div>
        <form onSubmit={handleSubmit} >
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 mt-3 border rounded-lg focus:outline-none"
          />
          <div className="relative mt-3">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-black" /> Remember me
            </label>
            <Link href="/reset-password" className="text-blue-500">Reset password?</Link>
          </div>
          <button type="submit" className="mt-4 w-full py-2 bg-black text-white rounded-lg">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm">
          Don’t have an account?{' '}
          <Link href="/admin/auth/Signup" className="text-blue-500">New Account</Link>
        </p>
      </div>
      {/* Right Section: Sign-in Form */}
      <div className="hidden lg:flex flex-col items-center justify-center w-[70%]   p-10">
        <Image src={logo} alt="logo" width={100} height={100} />
        <h1 className="mt-4 text-4xl font-bold">Welcome to Shop.ce</h1>
        <p className="mt-2 text-lg text-center max-w-md">
          Shop the latest trends in fashion, from Korean styles to Western and Old Money fashion. Your perfect outfit is just a click away!
        </p>
      </div>
    </div>
  );
};

export default SignIn;