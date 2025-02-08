"use client"
import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/src/assests/images/Logo.png";

const SignUp = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(user);
  };

  return (
    <div className="flex min-h-screen">
    {/* Left Section: Welcome Message */}
    <div className="hidden lg:flex flex-col items-center justify-center w-[70%]  p-10">
      <Image src={logo} alt="logo" width={100} height={100} />
      <h1 className="mt-4 text-4xl font-bold">Welcome to Shop.co</h1>
      <p className="mt-2 text-lg text-center max-w-md">
        Shop the latest trends in fashion, from Korean styles to Western and Old Money fashion. Your perfect outfit is just a click away!
      </p>
    </div>
    <div className="flex flex-col justify-center w-full lg:w-1/2 bg-gray-100 px-6 py-10">
      <h2 className="mt-4 text-3xl font-semibold">Sign Up</h2>

      <div className="mt-3 w-full max-w-md bg-inherit p-6 rounded-lg ">
      <div className="mt-3 mb-6 w-full max-w-md border-b border-gray-300 text-center relative">
          <span className="bg-gray-100 px-2 text-gray-500 absolute -top-3 left-1/2 transform -translate-x-1/2"></span>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={user.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md mb-3"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md mb-3"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={user.username}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md mb-3"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md mb-3"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit" className="w-full py-2 bg-black text-white rounded-md mt-4">
            Create Account
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account? <Link href="/admin/auth/Signin" className="text-blue-600">Sign in</Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default SignUp;
