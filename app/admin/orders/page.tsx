"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronDownIcon, Eye, Pencil } from "lucide-react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";

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
  const [show, setShow] = useState<boolean>(false);

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
          image,
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
  const filteredData = useMemo(() => filterData(filter), [filter, data, filterData]);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredData.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredData.length / ordersPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  


  return (
    <div className="overflow-x-hidden min-h-screen  flex flex-col gap-4 md: px-3 py-6 bg-gray-100 w-auto lg:ml-16">
      <div className="flex flex-col gap-2 md:gap-2">
        <div className="flex justify-between">
          <h1 className="lg:text-3xl text-2xl md:font-bold font-bold">Orders</h1>
          <div className="flex gap-2 md:hidden">
            <button className="bg-black text-white px-4 py-2 rounded text-xs md:text-sm" onClick={() => setShow(!show)}>Dates</button>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline md:text-lg text-xs">
            Dashboard
          </Link>
          <ChevronDownIcon size={16} color="grey" className="rotate-[-90deg] md:text-lg text-xs" />
          <Link href="/admin/orders" className="text-gray-500 hover:underline md:text-lg text-xs">
            Orders
          </Link>
        </div>
      </div>
      <div className={`flex md:flex-nowrap flex-wrap gap-2 lg:gap-4 md:gap-4 mb-4 bg-white border-2 border-gray-100 rounded-md lg:w-[73%] xl:w-[46%] p-2 ${show ? "block" : "hidden"} md:flex md:text-sm text-xs`}>
        {["All", "Today", "7 Days", "24 Hours", "This Month", "This Year"].map((option) => (
          <button
            key={option}
            onClick={() => {
              setFilter(option);
              setCurrentPage(1);
            }}
            className={`md:px-4 md:py-2 p-2 rounded-md ${filter === option ? "bg-black text-white" : "bg-gray-200 text-black"}`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="w-full overflow-auto bg-white md:m-2  rounded-lg shadow-lg  ">
        <table className="min-w-full border-collapse border-2 border-gray-200 rounded-lg md:text-lg text-[8px]">
          <thead>
            <tr className="bg-gray-50 text-center ">
              <th className="md:py-4 md:px-2">Product</th>
              <th className="md:py-4 md:px-2 md:pr-2 pl-10">Customer</th>
              <th className="md:py-4 md:px-2">Total</th>
              <th className="md:py-4 md:px-2">Payment Method</th>
              <th className="md:py-4 md:px-2">Status</th>
              <th className="md:py-4 md:px-2">Date</th>
              <th className="md:py-4 md:px-2">Action</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {currentOrders.map((order) => (
              <tr key={order._id} className="border-b-2 border-gray-100 hover:bg-gray-50 text-nowrap text-center">

                <td className="md:py-4 mdpx-2 flex items-center gap-2">
                  {order.products?.length > 0 && order.products[0]?.image ? (
                    <Image
                      src={order.products[0].image}
                      alt={order.products[0]?.name || "Product Image"}
                      className="md:w-10 md:h-10 w-5 h-5 rounded-md"
                      width={40}
                      height={40}
                    />
                  ) : (
                    "N/A"
                  )}
                  {order.products?.length > 0 ? order.products[0]?.name : "N/A"}
                </td>
                <td className="md:py-4 md:px-2 pl-10 pr-2 py-2">{order.firstName} {order.lastName}
                  <div className="md:text-xs text-[5px] text-gray-400 ">{order.email}</div></td>
                <td className="md:py-4 md:px-2">${order.total}</td>
                <td className="md:py-4 md:px-2">{order.paymentMethod}</td>
                <td className="md:py-4 md:px-2">
                  <span className={`md:py-2 md:px-2 px-2 py-1 rounded-xl md:text-sm text-[8px] ${order.status === "Completed" ? "bg-green-100 text-green-600" :
                    order.status === "Pending" ? "bg-yellow-100 text-yellow-600 " :
                      order.status === "Cancelled" ? "bg-red-100 text-red-600" :
                        "bg-gray-100 text-gray-600"
                    }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(order._createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 flex justify-center gap-2 md:text-sm text-xs">
                  <Link href={`/admin/orders/${order._id}`}>
                    <Eye className="md:w-5 w-3 md:h-5 h-3  cursor-pointer text-gray-600 hover:text-gray-900 " />
                  </Link>
                  <Pencil className="md:w-5 w-3 md:h-5 h-3  cursor-pointer text-blue-600 hover:text-blue-900" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className='bg-black px-4 py-2 border-2 rounded-md text-white md:block hidden'>Previous</button>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className='bg-black px-4 py-2 border-2 rounded-md text-white md:hidden block'>
          <ChevronDownIcon size={15} className='rotate-[90deg]' />
        </button>
        <div className="md:flex md:gap-4 hidden">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button key={page} onClick={() => paginate(page)} className={`${currentPage === page ? "bg-black text-white" : "bg-gray-200"} rounded-md px-2 py-1`}>{page}</button>
          ))}
        </div>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className='bg-black px-4 py-2 border-2 rounded-md text-white md:block hidden'>Next</button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className='bg-black px-4 py-2 border-2 rounded-md text-white md:hidden block'>
          <ChevronDownIcon size={15} className='rotate-[-90deg]' />
        </button>
      </div>

    </div>
  );
};
export default Orders;
