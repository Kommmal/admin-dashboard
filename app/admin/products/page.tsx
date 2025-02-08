"use client";
import React, { useState, useEffect } from 'react';
import { client } from "@/sanity/lib/client";
import { ChevronDownIcon, Eye, Pencil, Trash } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';




interface Product {
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

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterStock, setFilterStock] = useState<string>("");
  const [filterPrice, setFilterPrice] = useState<number | null>(null);
  const [filterDateRange, setFilterDateRange] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const productsPerPage: number = 10;

  useEffect(() => {
    const fetchData = async () => {
      const query = `*[_type == "products"]{
        _id,
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
         "slug": slug.current
      }`;
      const result = await client.fetch(query);
      setProducts(result);
    };
    fetchData();
  }, []);

  

  const checkDateFilter = (dateString: string, range: string) => {
    const productDate = new Date(dateString);
    const today = new Date();
    switch (range) {
      case "Today": return productDate.toDateString() === today.toDateString();
      case "This Month": return productDate.getMonth() === today.getMonth() && productDate.getFullYear() === today.getFullYear();
      case "This Year": return productDate.getFullYear() === today.getFullYear();
      case "Last 7 Days": return (today.getTime() - productDate.getTime()) / (1000 * 3600 * 24) <= 7;
      default: return true;
    }
  };
  
  const filteredProducts = products.filter(product => {
    const dateCondition = filterDateRange ? checkDateFilter(product._createdAt, filterDateRange) : true;
    return (
      (!filterCategory || product.category.toLowerCase().includes(filterCategory.toLowerCase())) &&
      (!filterStatus || 
        (filterStatus === "Published" && product.stock > 6) || 
        (filterStatus === "Out of Stock" && product.stock === 0) || 
        (filterStatus === "Low Stock" && product.stock > 0 && product.stock <= 5))
       &&
      (!filterStock || (filterStock === "Low Stock" ? product.stock < 5 : product.stock === 0)) &&
      (!filterPrice || product.price <= filterPrice) &&
      dateCondition
    );
  });
  

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleView = (product: Product) => {
    console.log("Viewing product:", product);
  };

  const handleEdit = (product: Product) => {
    
  };

  const handleDelete = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(product => product._id !== productId));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold">Product List</h1>
      <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2 items-center">
          <Link href="/admin/dashboard" className="text-black hover:underline">Dashboard</Link>
          <ChevronDownIcon size={16} color="grey" className="rotate-[-90deg]" />
          <Link href="/admin/products" className="text-gray-500 hover:underline">Products</Link>
        </div>
        <div className="flex gap-2">
          <button className="bg-black text-white px-4 py-2 rounded" onClick={() => setShowFilters(!showFilters)}>Filters</button>
          <Link href="/admin/addproducts"><button className="bg-black text-white px-4 py-2 rounded" >Add Products</button></Link>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 w-[51%] rounded shadow-md mb-4 flex flex-wrap gap-4">
          <select onChange={(e) => setFilterCategory(e.target.value)} className="border p-2 rounded bg-gray-200 ">
            <option value="">All Categories</option>
            <option value="tshirt">T-shirt</option>
            <option value="jeans">Jeans</option>
            <option value="hoodie">Hoodie</option>
            <option value="shirt">Shirt</option>
            <option value="short">Short</option>
          </select>

          <select onChange={(e) => setFilterStatus(e.target.value)} className="border p-2 rounded bg-gray-200 ">
            <option value="">All Status</option>
            <option value="Published">Published</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <select onChange={(e) => setFilterStock(e.target.value)} className="border p-2 rounded bg-gray-200 ">
            <option value="">All Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <select onChange={(e) => setFilterDateRange(e.target.value)} className="border p-2 rounded bg-gray-200 ">
            <option value="">All Dates</option>
            <option value="Today">Today</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
          </select>
        </div>
      )}

<table className="w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3"><input type="checkbox" /></th>
            <th className="p-3">Product</th>
            <th className="p-3">Category</th>
            <th className="p-3">SKU</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Price</th>
            <th className="p-3">Status</th>
            <th className="p-3">Added</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product._id} className="border-b border-gray-300">
              <td className="p-3"><input type="checkbox" /></td>
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


              <td className="p-3">{new Date(product._createdAt).toLocaleDateString()}</td>
              <td className="p-3 flex gap-2">
              <Link href={`/admin/products/${product.slug}`}>
                  <Eye className="w-5 h-5 cursor-pointer text-gray-600 hover:text-gray-900" />
                </Link>
                <Pencil className="w-5 h-5 cursor-pointer text-blue-600 hover:text-blue-900" onClick={() => handleEdit(product)} />
                <Trash className="w-5 h-5 cursor-pointer text-red-600 hover:text-red-900" onClick={() => handleDelete(product._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>



      <div className="mt-4 flex justify-between items-center">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className='bg-black px-4 py-2 border-2 rounded-md text-white'>Previous</button>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button key={page} onClick={() => paginate(page)} className={`${currentPage === page ? "bg-black text-white" : "bg-gray-200"} rounded-md px-2 py-1`}>{page}</button>
          ))}
        </div>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className='bg-black px-4 py-2 border-2 rounded-md text-white'>Next</button>
      </div>
    </div>
  );
};

export default ProductTable;
