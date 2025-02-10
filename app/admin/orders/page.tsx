"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";

interface Order{
  _id: string;
  email:string;
}

interface User{
  id: string;
  firstName: string;
  lastName: string;
  emailAddresses:string[];
  emailAddress: string[];
  banned: boolean;
  locked: boolean;
  orderQuantity: number;
  imageUrl: string;
  phoneNumber: number;
}

const UsersTable = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    
    useEffect(() => {
      const fetchUsersAndOrders = async () => {
        try {
          const usersRes = await fetch("/api/get-users");
          const usersData = await usersRes.json();
          setUsers(usersData || []);
  
          const ordersRes = await client.fetch("*[_type == 'order']");
          setOrders(ordersRes || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsersAndOrders();
    }, []);

    const paginate = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(users.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    
    const filteredUsers = users.map(user => {
      const userEmail = user.emailAddresses?.[0]?.emailAddress || "";
      const userOrders = orders.filter(order => order.email === userEmail);
      return {
        ...user,
        orderQuantity: userOrders.length || 0,
        status: user.banned || user.locked ? "Blocked" : "Active"
      };
    }).filter(user => user.firstName?.toLowerCase().includes(search.toLowerCase()))
      .slice(indexOfFirstUser, indexOfLastUser);

    return (
      <div className="overflow-x-hidden px-3 py-6 bg-gray-100 min-h-screen">
        <div className="flex md:justify-between md:flex-row flex-col gap-3 md:items-center mb-4">
          <h2 className="md:text-2xl text-left text-xl font-bold">Customer List</h2>
          <div className="flex md:space-x-2 space-x-3">
            <Input
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded md:text-sm text:xs"
            />
            <Button className="bg-black text-white px-4 py-2 rounded md:text-sm text:xs">+ Add Customer</Button>
          </div>
        </div>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="w-full overflow-auto bg-white md:m-4 rounded-lg shadow-lg ">
            <table className="w-full bg-white shadow-md rounded-lg xl:text-xl md:text-sm text-[8px] text-nowrap">
              <thead>
                <tr className="bg-gray-200 text-center">
                  <th className="md:py-4 md:px-2 p-2">Customer Name</th>
                  <th className="md:py-4 md:px-2 pl-6 py-2 pr-2">Email</th>
                  <th className="md:py-4 md:px-2 p-2">Orders</th>
                  <th className="md:py-4 md:px-2 p-2">Balance</th>
                  <th className="md:py-4 md:px-2 p-2">Status</th>
                  <th className="md:py-4 md:px-2 p-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b text-center">
                    <td className="md:py-4 md:px-2 p-2 flex gap-2 items-center">
                      <Image alt="userImage" src={user.imageUrl} height={30} width={40} className="rounded-full md:w-10 md:h-10 w-5 h-5 "/>
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="md:py-4 md:px-2 p-2 pr-8">{user.emailAddresses?.[0]?.emailAddress || "N/A"}</td>
                    <td className="md:py-4 md:px-2 p-2">{user.orderQuantity}</td>
                    <td className="md:py-4 md:px-2 p-2">${(Math.random() * 1000).toFixed(2)}</td>
                    <td className={`md:py-4 md:px-2 p-2 ${user.status === "Active" ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{user.status}</td>
                    <td className="md:py-4 md:px-2 p-2">{new Date().toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center gap-2 mt-4">
          <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
          {[...Array(totalPages)].map((_, index) => (
            <Button key={index} onClick={() => paginate(index + 1)}>{index + 1}</Button>
          ))}
          <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
        </div>
      </div>
    );
  };

  export default UsersTable;
