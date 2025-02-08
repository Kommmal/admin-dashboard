"use client"
import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
// import Logo from "@/public/logo.png"; // Update path accordingly

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <Link href="/" className="inline-block">
          {/* <Image src={Logo} alt="Shop.ce Logo" width={92} height={92} /> */}
        </Link>
        <h2 className="text-2xl font-semibold mt-6">Recover</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={handleInputChange}
            placeholder="mail@example.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
          >
            Reset Your Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
