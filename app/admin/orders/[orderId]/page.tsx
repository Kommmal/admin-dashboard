"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
    name: string;
    image?: string;
    sku: number;
    quantity: number;
    sizes: string[];
    colors: string[];
    price: number;
}

interface Order {
    _id: string;
    firstName: string;
    lastName: string;
    total: number;
    paymentMethod: string;
    zip: string;
    address: string
    email: string;
    status: string;
    phone: string;
    _createdAt: string;
    products: Product[];
}

const OrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (!orderId) return;

        const fetchOrder = async () => {
            const query = `*[_type == "order" && _id == "${orderId}"][0]{
        _id,
        firstName,
        lastName,
        email,
        paymentMethod,
        status,
        total,
        _createdAt,
        address,
        zip,
        phone,
        products[] {
          name,
          image,
          price,
          quantity,
          sizes,
          colors,
          sku
        }
      }`;

            const result = await client.fetch(query);
            setOrder(result);
        };

        fetchOrder();
    }, [orderId]);

    if (!order) return <div>Loading...</div>;

    return (
        <div className="overflow-x-hidden min-h-screen flex flex-col gap-6 p-6 bg-gray-100">
            <div className="flex flex-col gap-2">
                <h1 className="md:text-3xl text-2xl md:font-bold font-bold">Order Detail</h1>
                <div className="flex gap-2 items-center">
                    <Link href="/admin/dashboard" className="text-blue-600 hover:underline md:text-lg text-sm">
                        Dashboard
                    </Link>
                    <ChevronDownIcon size={16} color="grey" className="rotate-[-90deg] md:text-lg text-xs" />
                    <Link href="/admin/orders" className="text-gray-500 hover:underline md:text-lg text-xs">
                        Orders
                    </Link>
                    <ChevronDownIcon size={16} color="grey" className="rotate-[-90deg] md:text-lg text-xs" />
                    <Link href="/admin/orders/orderDetail" className="text-gray-500 hover:underline md:text-lg text-xs">
                        Orders Details
                    </Link>
                </div>
            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between py-2">
                        <h2 className="md:text-xl text-[20px] font-semibold md:font-semibold">Order</h2>
                        <div className={`px-2 py-1 rounded-full text-sm ${order.status === "Shipped" ? "bg-green-100 text-green-600 border rounded-xl border-green-100 text-sm px-4 py-1" :
                            order.status === "Pending" ? "bg-yellow-100 text-yellow-600 border rounded-xl border-yellow-100 text-sm px-4 py-1" :
                                order.status === "Delivered" ? "bg-blue-100 text-blue-600 border rounded-xl border-blue-100 text-sm px-4 py-1" :
                                    "bg-gray-100 text-gray-600"
                            }`}>
                            {order.status}
                        </div>
                    </div>
                    <div className="flex justify-between py-2">
                        <p className=""><strong>Date:</strong></p>
                        <p>{new Date(order._createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-between py-2">
                        <p><strong>Payment Method:</strong></p>
                        <p>{order.paymentMethod}</p>
                    </div>
                    <div className="flex justify-between py-2">
                        <p><strong>Shipping Method:</strong></p>
                        <p>Flat Shipping</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold">Customer</h2>
                    <div className="flex justify-between py-2">
                        <p><strong>Customer</strong></p>
                        <p>{order.firstName}{order.lastName}</p>
                    </div>
                    <div className="flex justify-between py-2">
                        <p><strong>Email:</strong></p>
                        <p>{order.email}</p>
                    </div>
                    <div className="flex justify-between py-2">
                        <p><strong>Phone </strong></p>
                        <p>{order.phone}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold">Address</h2>
                    <div className=" py-2">
                        <p><strong>Billing Adress</strong></p>
                        <p>{order.address}</p>
                    </div>
                    <div className="  py-2">
                        <p><strong>Shipping Adress</strong></p>
                        <p>{order.address}</p>
                    </div>

                </div>
            </div>
            <div className="bg-white border border- rounded-lg shadow-lg w-full ">
                <h2 className="text-xl p-6 font-semibold">Products</h2>
                <div className="w-full overflow-auto bg-white md:m-4  rounded-lg shadow-lg">
                <table className="w-full bg-white border rounded-lg md:text-xl text-sm text-nowrap">
                    <thead className="text-center">
                        <tr className="bg-gray-100 border-gray-300">
                            <th className="p-3">Product</th>
                            <th className="md:p-3 pl-10 pr-2 py-3">SKU</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Color</th>
                            <th className="p-3">Size</th>
                            <th className="p-3">Quantity</th>
                            <th className="p-3">Total</th>
                        </tr>
                    </thead>
                    <tbody className="w-full">
                        {order.products.map((product, index) => (
                            <tr key={index} className="text-center border-b border-gray-300">
                                <td className="py-4 px-2 flex items-center gap-2">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name || "Product Image"}
                                            className="w-10 h-10 rounded-md"
                                        />
                                    ) : (
                                        "N/A"
                                    )}
                                    {product.name || "N/A"}
                                </td>
                                <td className="md:py-4 md:px-2 pl-12 pr-2 py-2">{product.sku}</td>
                                <td className="py-4 px-2">${product.price}</td>
                                <td className="py-4 px-2">{product.colors}</td>
                                <td className="py-4 px-2">{product.sizes}</td>
                                <td className="py-4 px-2">{product.quantity}</td>
                                <td className="py-4 px-2">${(product.price * product.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="text-center font-semibold  border-b border-gray-300">
                            <td colSpan="5"></td> {/* Leaves first 5 columns empty */}
                            <td className="py-4 px-2">Subtotal</td>
                            <td className="py-4 px-2">${order.products.reduce((acc, product) => acc + product.price * product.quantity, 0).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
                </div>
            </div>

        </div>
    );
};

export default OrderDetail;
