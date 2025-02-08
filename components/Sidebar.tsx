"use client"
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, User, ShoppingCart, Package, Truck, Settings, LayoutDashboard, Menu, ChevronDownIcon, List, ListIcon, Plus, PlusCircle } from "lucide-react";
import Link from 'next/link';

const Sidebar = () => {
  const pathname = usePathname(); // Get the current pathname
  const [isHamburgerClicked, setIsHamburgerClicked] = useState(false);
  const [isProductClicked, setIsProductClicked] = useState(false)

  const toggleSidebar = () => {
    setIsHamburgerClicked((prevState) => !prevState);
  };

  // Check if the current route is the login page
  const isLoginPage = pathname === '/login';

  if (isLoginPage) return null; // Don't render Sidebar on the login page

  return (
    <div className={` fixed top-0 left-0 h-full bg-white rounded-r-lg shadow-lg  p-4 transition-all duration-300 ease-in-out ${isHamburgerClicked ? 'w-64' : 'w-16'}`}>
      <div className=" text-xl font-bold mb-6 flex items-center justify-between mt-4">
        <h2 className={`${isHamburgerClicked ? 'block' : 'hidden'}`}>Shop.Co</h2>
        <div className=" cursor-pointer text-2xl " onClick={toggleSidebar}>
          <Menu size={30} />
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
            <Package size={18} />
            <span className={`${isHamburgerClicked ? 'block' : 'hidden'}`}>Products</span>
          </div>
          <div>
            <ChevronDownIcon size={18} className={`${isHamburgerClicked ? 'block' : 'hidden'} ${isProductClicked ? 'hidden' : "block" }`} onClick={() => setIsProductClicked(true)} />
            <ChevronDownIcon size={18} className={`${isHamburgerClicked ? 'block' : 'hidden'} ${isProductClicked ? 'block' : "hidden" } rotate-[180deg]`} onClick={() => setIsProductClicked(false)} />
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
        
      </div>


    </div>
  );
};

export default Sidebar;
