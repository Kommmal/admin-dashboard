"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { client } from "@/sanity/lib/client";

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchUsersAndOrders = async () => {
        try {
          const usersRes = await fetch("/api/get-users");
          const usersData = await usersRes.json();
          console.log("Fetched Users:", usersData);
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
  
    const filteredUsers = users.map(user => {
      const userEmail = user.emailAddresses?.[0]?.emailAddress || "";
      const userOrders = orders.filter(order => order.email === userEmail);
      console.log("User Status:", user.banned, user.locked);
      
      return {
        ...user,
        orderQuantity: userOrders.length || 0,
        status: user.banned || user.locked ? "Blocked" : "Active"
      };
    }).filter(user => user.firstName?.toLowerCase().includes(search.toLowerCase()));
  
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Customer List</h2>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded"
            />
            <Button className="bg-blue-500 text-white px-4 py-2 rounded">+ Add Customer</Button>
          </div>
        </div>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3">Customer Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Balance</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-3">{user.firstName} {user.lastName}</td>
                  <td className="p-3">{user.emailAddresses?.[0]?.emailAddress || "N/A"}</td>
                  <td className="p-3">{user.phoneNumber || "N/A"}</td>
                  <td className="p-3">{user.orderQuantity}</td>
                  <td className="p-3">${(Math.random() * 1000).toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-white ${user.status === "Active" ? 'bg-green-500' : 'bg-red-500'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date().toLocaleDateString()}</td>
                  <td className="p-3 space-x-2">
                    <Button className="bg-gray-300 px-2 py-1">👁️</Button>
                    <Button className="bg-blue-500 text-white px-2 py-1">✏️</Button>
                    <Button className="bg-red-500 text-white px-2 py-1">🗑️</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };
  
  export default UsersTable;
  