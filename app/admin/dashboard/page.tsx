"use client"
import { useState, useEffect } from "react";
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

interface TopSelling {
  _id: string;
  name: string;
  category: string;
  price: number;
  tags: string[];
  isNew: boolean;
  _createdAt: string;
  image: string;
  sku: string;
  stock: number;
  status: string;
  slug: string
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<TopSelling[]>([]);
 
  useEffect(() => {
    client.fetch(`*[_type == "order"][0..6]{
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
      }
        `).then((data) => setOrders(data));
    client.fetch(`*[_type == "products" && tags == "bestselling"]
      {_id,
        name,
        "image": image.asset->url,
        category,
        _createdAt,
        tags,
        price,
        isNew,
        sku,
        stock,
        status,
        }`).then((data) => setTopSellingProducts(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6  ">
      <h1 className="text-3xl font-semibold text-center mb-10">Shop.co Dashboard</h1>

      {/* Stats Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-2">Total Sale Revenue</h3>
          <p className="text-3xl font-bold">$20,000</p>
        </div>
        <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">150</p>
        </div>
        <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-2">Total Sales</h3>
          <p className="text-3xl font-bold">300</p>
        </div>
        <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-2">Total Top-Selling Products</h3>
          <p className="text-3xl font-bold">10</p>
        </div>
      </section>

      {/* Orders Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-medium mb-4">Recent Orders</h2>
        <table className="min-w-full bg-gray-50 border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-200 ">
            <tr>
              <th className="py-4 px-2">Product</th>
              <th className="py-4 px-2">Customer</th>
              <th className="py-4 px-2">Total</th>
              <th className="py-4 px-2">Date</th>
              <th className="py-4 px-2">Payment Method</th>
              <th className="py-4 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center border-b hover:bg-gray-300">
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
                <td className="px-4 py-2">{new Date(order._createdAt).toLocaleDateString()}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Top Selling Products Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-medium mb-4">Top Selling Products</h2>
        <table className="min-w-full bg-gray-50 border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-200  ">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {topSellingProducts.map((product, index) => (
              <tr key={index} className="border-b border-gray-300" >
                <td className="p-3 flex items-center gap-2">
                  <Image src={product.image} alt={product.name} width={30} height={30} className="rounded-md" />
                  {product.name}
                </td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">{product.sku}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">${product.price}</td>
                <td className="p-3">
                  {product.status === "Published" && product.stock >= 5 ? (
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded">Published</span>
                  ) : product.stock === 0 ? (
                    <span className="bg-red-200 text-red-800 px-2 py-1 rounded">Out of Stock</span>
                  ) : product.stock > 0 && product.stock < 5 ? (
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Low Stock</span>
                  ) : null}
                </td>



              </tr>

            ))}
          </tbody>
        </table>
      </section>

      {/* Charts Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-medium mb-4">Sales and Performance</h2>
        <div className="flex gap-10">
          {/* Vertical Building Chart (Top Selling Products) */}
          <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Top Selling Products</h3>
            <div className="relative flex items-end gap-4 h-72">
              {/* Y-Axis with labels */}
              <div className="absolute left-0 top-0 flex flex-col justify-between h-full  text-sm">
                {[200, 150, 100, 50, 0].map((value, index) => (
                  <div key={index} className="h-full flex items-center justify-end">
                    <span>{value}</span>
                  </div>
                ))}
              </div>

              {/* Bar Chart with X-Axis */}
              <div className="flex-1 flex items-end gap-10 pl-16 pb-4">
                {topSellingProducts.map((product, index) => {
                  const salesValue = (index + 1) * 100;
                  const barHeight = Math.max(salesValue, 40); 

                  return (
                    <div key={index} className="relative w-16 flex flex-col items-center group">
                      <div
                        className="bg-blue-500 w-full  rounded-t-lg"
                        style={{ height: `${barHeight}px` }}
                      ></div>

                      
                      <div className="absolute bottom-full mb-2 p-2 bg-gray-800 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-sm">{product.name}</p>
                        <p className="font-bold">{`$${product.price}`}</p>
                      </div>

                
                    </div>
                  );
                })}
              </div>

              
            </div>
          </div>

          <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-md ">
            <h3 className="text-xl font-semibold mb-4">Order Status Distribution</h3>
            <div className="w-64 h-64 mx-auto flex justify-center bg-gray-600 rounded-full ">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: "conic-gradient(#4CAF50 0% 33%, #FF5733 33% 66%, #FFC107 66% 100%)", // Divide into 3 equal parts
                }}
              ></div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
