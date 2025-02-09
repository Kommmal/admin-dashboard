"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronDownIcon, Eye, Pencil } from "lucide-react";
import { client } from "@/sanity/lib/client";

interface Product {
  name: string;
  image?: string;
}

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  total: number;
  paymentMethod: string;
  email: string;
  status: string;
  _createdAt: string;
  products: Product[];
}

const Orders = () => {
  const [data, setData] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const query = `*[_type == "order"]{
        _id,
        firstName,
        lastName,
        email,
        paymentMethod,
        status,
        total,
        _createdAt,
        products[] {
          name,
          image
        }
      }`;
      const result = await client.fetch(query);
      setData(result);
    };

    fetchData();
  }, []);

  const filterData = (filter: string) => {
    const now = new Date();
    if (filter === "Today") {
      return data.filter(
        (order) => new Date(order._createdAt).toDateString() === now.toDateString()
      );
    } else if (filter === "7 Days") {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return data.filter((order) => new Date(order._createdAt) >= weekAgo);
    } else if (filter === "24 Hours") {
      const dayAgo = new Date(now);
      dayAgo.setHours(now.getHours() - 24);
      return data.filter((order) => new Date(order._createdAt) >= dayAgo);
    } else if (filter === "This Month") {
      return data.filter(
        (order) =>
          new Date(order._createdAt).getMonth() === now.getMonth() &&
          new Date(order._createdAt).getFullYear() === now.getFullYear()
      );
    } else if (filter === "This Year") {
      return data.filter(
        (order) => new Date(order._createdAt).getFullYear() === now.getFullYear()
      );
    } else {
      return data;
    }
  };

  const filteredData = useMemo(() => filterData(filter), [filter, data]);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredData.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredData.length / ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleView = (orderId: string) => {
    alert(`Viewing details for order ID: ${orderId}`)
  }

  const handleEdit = (orderId: string) => {
    alert(`Editing order ID: ${orderId}`);
  }

  return (
    <div className="min-h-screen flex flex-col gap-4 p-6 bg-gray-100">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="flex gap-2 items-center">
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
            Dashboard
          </Link>
          <ChevronDownIcon size={16} color="grey" className="rotate-[-90deg]" />
          <Link href="/admin/orders" className="text-gray-500 hover:underline">
            Orders
          </Link>
        </div>
      </div>

      <div className="flex gap-4 mb-4 bg-white border-2 border-gray-100 rounded-md w-[51%] p-2">
        {["All", "Today", "7 Days", "24 Hours", "This Month", "This Year"].map((option) => (
          <button
            key={option}
            onClick={() => {
              setFilter(option);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-md ${filter === option ? "bg-black text-white" : "bg-gray-200 text-black"
              }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="w-[90%] bg-white m-4 rounded-lg shadow-lg">
        <table className="min-w-full border-collapse border-2 border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="py-4 px-2">Product</th>
              <th className="py-4 px-2">Customer</th>
              <th className="py-4 px-2">Total</th>
              <th className="py-4 px-2">Payment Method</th>
              <th className="py-4 px-2">Status</th>
              <th className="py-4 px-2">Date</th>
              <th className="py-4 px-2">Action</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {currentOrders.map((order) => (
              <tr key={order._id} className="border-b-2 border-gray-100 hover:bg-gray-50 ">

                <td className="py-4 px-2 flex items-center gap-2">
                  {order.products?.length > 0 && order.products[0]?.image ? (
                    <img
                      src={order.products[0].image}
                      alt={order.products[0]?.name || "Product Image"}
                      className="w-10 h-10 rounded-md"
                    />
                  ) : (
                    "N/A"
                  )}
                  {order.products?.length > 0 ? order.products[0]?.name : "N/A"}
                </td>
                <td className="">{order.firstName} {order.lastName}
                  <div className="text-xs text-gray-400 ">{order.email}</div></td>
                <td className="py-4 px-2">${order.total}</td>
                <td className="py-4 px-2">{order.paymentMethod}</td>
                <td className="py-4 px-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${order.status === "Completed" ? "bg-green-100 text-green-600" :
                    order.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                      order.status === "Cancelled" ? "bg-red-100 text-red-600" :
                        "bg-gray-100 text-gray-600"
                    }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(order._createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <Link href={`/admin/orders/${order._id}`}>
                    <Eye className="w-5 h-5 cursor-pointer text-gray-600 hover:text-gray-900" />
                  </Link>
                  <Pencil className="w-5 h-5 cursor-pointer text-blue-600 hover:text-blue-900" onClick={() => handleEdit(order._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      <div className="flex justify-around items-center gap-2 mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-md ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-black text-white"}`}
        >
          Previous
        </button>
        <div className="flex gap-4">

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-2 rounded-md ${currentPage === index + 1 ? "bg-black text-white" : "bg-gray-200"}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-black text-white"}`}
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default Orders;
