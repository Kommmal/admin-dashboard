import React from 'react';
import Link from 'next/link';
import { ChevronDownIcon, Eye, Pencil, Trash } from "lucide-react";
import { client } from "@/sanity/lib/client";

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  total: number;
  paymentMethod: string;
  email: string;
  status: string;
  _createdAt: string;
}

const fetchData = async () => {
  const query = `*[_type == "order"]{
    _id,
    firstName,
    lastName,
    paymentMethod,
    total,
    email,
    status,
    _createdAt
  }`;
  const data = await client.fetch(query);
  return data;
};

const Orders = async () => {
  const data = await fetchData();
  return (
    <div className="min-h-screen flex flex-col gap-4 pt-6 w-[90%] bg-gray-100 ml-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="flex gap-2 items-center">
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
          <ChevronDownIcon size={16} color="grey" className="rotate-[-90deg]" />
          <Link href="/admin/orders" className="text-gray-500 hover:underline">Orders</Link>
        </div>
      </div>

      <div className="w-full bg-white m-4 rounded-lg shadow-lg">
        <table className="min-w-full border-collapse border-2 border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="py-4 px-2">Customer</th>
              <th className="py-4 px-2">Email</th>
              <th className="py-4 px-2">Total</th>
              <th className="py-4 px-2">Payment Method</th>
              <th className="py-4 px-2">Status</th>
              <th className="py-4 px-2">Date</th>
              <th className="py-4 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order: Order) => (
              <tr key={order._id} className="border-b-2 border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-2">{order.firstName} {order.lastName}</td>
                <td className="py-4 px-2">{order.email}</td>
                <td className="py-4 px-2">${order.total}</td>
                <td className="py-4 px-2">{order.paymentMethod}</td>
                <td className="py-4 px-2">
                  <span className={`px-2 py-1 rounded-full text-sm 
                    ${order.status === "Completed" ? "bg-green-100 text-green-600" :
                      order.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                      order.status === "Cancelled" ? "bg-red-100 text-red-600" :
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(order._createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <Eye className="w-5 h-5 cursor-pointer text-gray-600 hover:text-gray-900" />
                  <Pencil className="w-5 h-5 cursor-pointer text-blue-600 hover:text-blue-900" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
