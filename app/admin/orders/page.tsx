import React from 'react';
import Link from 'next/link';
import { ChevronDownIcon, Eye, Pencil, Trash } from "lucide-react";

const products = [
  { id: 1, name: "Handmade Pouch", sku: "302012", category: "Bag & Pouch", stock: 10, price: "$121.00", status: "Low Stock", added: "29 Dec 2022" },
  { id: 2, name: "Smartwatch E2", sku: "302011", category: "Watch", stock: 204, price: "$590.00", status: "Published", added: "24 Dec 2022" },
  { id: 3, name: "Smartwatch E1", sku: "302002", category: "Watch", stock: 48, price: "$125.00", status: "Draft", added: "12 Dec 2022" },
  { id: 4, name: "Headphone G1 Pro", sku: "301901", category: "Audio", stock: 401, price: "$348.00", status: "Published", added: "21 Oct 2022" },
  { id: 5, name: "Iphone X", sku: "301900", category: "Smartphone", stock: 120, price: "$607.00", status: "Published", added: "21 Oct 2022" },
  { id: 6, name: "Puma Shoes", sku: "301881", category: "Shoes", stock: 432, price: "$234.00", status: "Published", added: "21 Oct 2022" },
  { id: 7, name: "Imac 2021", sku: "301643", category: "PC Desktop", stock: 0, price: "$760.00", status: "Out of Stock", added: "19 Sep 2022" },
];

const Orders = () => {
  return (
    <div className="min-h-screen flex flex-col gap-4 pt-6 w-[90%] bg-gray-100 ml-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="flex gap-2 items-center">
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
          <ChevronDownIcon size={16} color="grey" className="rotate-[-90deg]" />
          <Link href="/admin/products" className="text-gray-500 hover:underline">Products</Link>
        </div>
      </div>

      <div className="w-full bg-white m-4 rounded-lg shadow-lg">
        <div className="">
          <table className="min-w-full border-collapse border-2 border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className=" py-4 px-2">Product</th>
                <th className=" py-4 px-2">Category</th>
                <th className=" py-4 px-2">Stock</th>
                <th className=" py-4 px-2">Price</th>
                <th className=" py-4 px-2">Status</th>
                <th className=" py-4 px-2">Added</th>
                <th className=" py-4 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className=" border-b-2 border-gray-100 hover:bg-gray-50">
                  <td className=" py-4 px-2">{product.name}</td>
                  <td className=" py-4 px-2">{product.category}</td>
                  <td className=" py-4 px-2">{product.stock}</td>
                  <td className=" py-4 px-2">{product.price}</td>
                  <td className=" py-4 px-2">
                    <span className={`px-2 py-1 rounded-full text-sm 
                      ${product.status === "Published" ? "bg-green-100 text-green-600" :
                        product.status === "Low Stock" ? "bg-yellow-100 text-yellow-600" :
                        product.status === "Out of Stock" ? "bg-red-100 text-red-600" :
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className=" px-4 py-2">{product.added}</td>
                  <td className=" px-4 py-2 flex justify-center gap-2">
                    <Eye className="w-5 h-5 cursor-pointer text-gray-600 hover:text-gray-900" />
                    <Pencil className="w-5 h-5 cursor-pointer text-blue-600 hover:text-blue-900" />
                    <Trash className="w-5 h-5 cursor-pointer text-red-600 hover:text-red-900" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
