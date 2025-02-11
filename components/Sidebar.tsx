"use client"
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, User, ShoppingCart, Package, Truck, Settings, LayoutDashboard, Menu, ChevronDownIcon, List, ListIcon, Plus, PlusCircle, X } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import Logo from "@/public/images/main-logo-black-transparent.png";
import UserSettings from './UserSettings';
import { useSession, signOut } from "next-auth/react";

const Sidebar = () => {
  const pathname = usePathname(); // Get the current pathname
  const [isHamburgerClicked, setIsHamburgerClicked] = useState(false);
  const [show, setShow] = useState(false)
  const [isProductClicked, setIsProductClicked] = useState(false)
  const { data: session, status } = useSession();
  const toggleSidebar = () => {
    setIsHamburgerClicked((prevState) => !prevState);
  };


  const isLoginPage = pathname === '/';

  if (isLoginPage) return null;

  return (
    <div className='flex justify-between w-full'>
      <div className={`fixed top-0 z-10 left-0 h-full bg-white rounded-r-lg shadow-lg transition-transform duration-500 ease-in-out  
  ${isHamburgerClicked ? 'w-64 p-4 translate-x-0' : 'lg:w-16 lg:p-4 w-0 sm:w-0 p-0 -translate-x-full lg:translate-x-0'}`}>


        <div className=" text-xl font-bold mb-6 flex items-center justify-between mt-4">
          <h2 className={`${isHamburgerClicked ? 'block' : 'hidden'}`}>Shop.Co</h2>
          <div className=" cursor-pointer text-2xl lg:block hidden" onClick={toggleSidebar}>
            <Menu size={30} />
          </div>
          <div className={`menu space-y-4 cursor-pointer text-2xl lg:hidden block ${isHamburgerClicked ? 'block' : 'hidden'}`} onClick={toggleSidebar}>
            <X size={30} />
          </div>
        </div>

        <div className="menu space-y-4">
          <Link href="/admin/dashboard" className="flex items-center space-x-3  hover:bg-black hover:text-white py-3 rounded-lg px-2 transition-colors">
            <LayoutDashboard size={18} />
            <span className={`${isHamburgerClicked ? 'block' : 'hidden'}`}>Dashboard</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center space-x-3  hover:bg-black hover:text-white py-3 rounded-lg px-2 transition-colors">
            <ShoppingCart size={18} />
            <span className={`${isHamburgerClicked ? 'block' : 'hidden'}`}>Orders</span>
          </Link>
          <div className="flex items-center justify-between space-x-3  hover:bg-black hover:text-white py-3 rounded-lg px-2 transition-colors">
            <div className='flex space-x-3'>
              <Package size={18} className='lg:block hidden' />
              <span className={`${isHamburgerClicked ? 'block' : 'hidden'}`}>Products</span>
            </div>
            <div>
              <ChevronDownIcon size={18} className={`${isHamburgerClicked ? 'block' : 'hidden'} ${isProductClicked ? 'hidden' : "block"}`} onClick={() => setIsProductClicked(true)} />
              <ChevronDownIcon size={18} className={`${isHamburgerClicked ? 'block' : 'hidden'} ${isProductClicked ? 'block' : "hidden"} rotate-[180deg]`} onClick={() => setIsProductClicked(false)} />
            </div>
          </div>
          <div className={`${isProductClicked ? 'block' : 'hidden'} ml-5`}>
            <Link href="/admin/products" className="flex items-center space-x-3  hover:bg-black hover:text-white py-3 rounded-lg px-2 transition-colors">
              <ListIcon size={18} />
              <span className={`${isHamburgerClicked ? 'block' : 'hidden'}`}>Product List</span>
            </Link>
            <Link href="/admin/addproducts" className="flex items-center space-x-3  hover:bg-black hover:text-white py-3 rounded-lg px-2 transition-colors">
              <PlusCircle size={18} />
              <span className={`${isHamburgerClicked ? 'block' : 'hidden'}`}>Add Product</span>
            </Link>
          </div>
          <Link href="/admin/user" className="flex items-center space-x-3  hover:bg-black hover:text-white py-3 rounded-lg px-2 transition-colors">
            <User size={18} />
            <span className={`${isHamburgerClicked ? 'block' : 'hidden'}`}>Customers</span>
          </Link>
          {session?.user && (
            <Link href="" className="flex items-center space-x-3  hover:bg-black hover:text-white py-3 rounded-lg px-2 transition-colors">
              <Settings size={18} />
              <span className={`${isHamburgerClicked ? 'block' : 'hidden'}`}>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full px-4 py-2 text-left ">
                  Logout
                </button>
              </span>
            </Link>
          )}

        </div>
      </div>
      <div className='w-full flex items-center justify-between lg:hidden  px-4  py-4 bg-gray-100 border-b border-gray-200'>
        <div className='flex gap-1'>
          <Image src={Logo} width={30} height={30} alt='logo' />
          <h1 className="lg:text-2xl text-xl font-semibold ">Shop.co</h1>
        </div>
        <div className=" cursor-pointer text-2xl " onClick={toggleSidebar}>
          <Menu size={30} />
        </div>
      </div>
    </div>

  );
};

export default Sidebar;
