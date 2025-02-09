"use client";
import { useState, useEffect, useMemo } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { OrdersBarChart } from "@/components/OrderBarChart";
import { OrderStatusPieChart } from "@/components/OrderStatusPieChart";
import customer from "@/src/assests/images/Customer Active.png";
import Dollar from "@/src/assests/images/Annual Goal.png";
import Truck from "@/src/assests/images/Services.png";
import Order from "@/src/assests/images/Services (2).png";

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
  slug: string;
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<TopSelling[]>([]);
  const [orderLength, setOrderLength] = useState<number>(0);
  const [filter, setFilter] = useState("Today");
  const [barFilter, setBarFilter] = useState("Today");

  useEffect(() => {
    client.fetch(`*[_type == "order"]{
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
      }`)
      .then((data) => {
        setOrders(data);
        setOrderLength(data.length);
      });

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

  // Filter orders by date
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return filter === "Today"
      ? orders.filter(order =>
        new Date(order._createdAt).toDateString() === now.toDateString()
      )
      : orders;
  }, [filter, orders]);


  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + order.total, 0);
  }, [orders]);


  const filterOrders = (barFilter: string) => {
    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order._createdAt);

      if (filter === "Today") {
        return orderDate.toDateString() === now.toDateString();
      }
      if (filter === "7 Days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return orderDate >= sevenDaysAgo;
      }
      if (filter === "Month") {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }
      if (filter === "Year") {
        return orderDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  // Compute sales based on filtered orders
  const totalSales = useMemo(() => {
    return filterOrders(barFilter).reduce((sum, order) => sum + order.total, 0);
  }, [orders, filter]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-10">Shop.ce Dashboard</h1>

      {/* Stats Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gray-100 flex gap-4 p-3 rounded-lg shadow-md ">
          <div>
            <Image alt="order png" src={Dollar} width={60} height={60}></Image>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1">Total Sale Revenue</h3>
            <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-gray-100 flex gap-4 p-3 rounded-lg shadow-md ">
          <div>
            <Image alt="order png" src={Order} width={60} height={60}></Image>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1">Total Orders</h3>
            <p className="text-3xl font-bold">{orderLength}</p>
          </div>
        </div>
        <div className="bg-gray-100 p-3 flex gap-4 rounded-lg shadow-md ">
          <div>
            <Image alt="order png" src={customer} width={60} height={60}></Image>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1">Orders Today</h3>
            <p className="text-3xl font-bold">{filteredOrders.length}</p>
          </div>
        </div>
        <div className="bg-gray-100 flex gap-4 p-3 rounded-lg shadow-md ">
          <div>
            <Image alt="order png" src={Truck} width={60} height={60}></Image>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1">Order Pending</h3>
            <p className="text-3xl font-bold">{orders.filter(order => order.status === "Pending").length}</p>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="mb-12 flex gap-5">
        <OrdersBarChart />
        {/* Order Status Distribution Chart */}
        <OrderStatusPieChart />
      </section>

      {/* Orders Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-medium mb-4">Recent Orders</h2>
        <table className="min-w-full bg-gray-50 border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-200">
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
            {filteredOrders.map(order => (
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
                <td>
                  {order.firstName} {order.lastName}
                  <div className="text-xs text-gray-400">{order.email}</div>
                </td>
                <td className="py-4 px-2">${order.total}</td>
                <td className="px-4 py-2">{new Date(order._createdAt).toLocaleDateString()}</td>
                <td className="py-4 px-2">{order.paymentMethod}</td>
                <td className="py-4 px-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${order.status === "Shipped" ? "bg-green-100 text-green-600" :
                    order.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                      order.status === "Delivered" ? "bg-red-100 text-blue-600" :
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


    </div>
  );
}
