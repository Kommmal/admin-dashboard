"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { client } from "@/sanity/lib/client";
import { SanityAssetDocument } from '@sanity/client';

interface ProductData {
  name: string;
  price: number | string;
  slug: string;
  description: string;
  image: File | null;
  category: string;
  tags: string;
  discountPercent: number | string;
  new: boolean;
  colors: string[];
  sizes: string[];
  stock: number | string;
}

const colorOptions = ['Red', 'Blue', 'Green', 'Black', 'White'];
const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

const AddProduct: React.FC = () => {
  const router = useRouter();
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    price: '',
    slug: '',
    description: '',
    image: null,
    category: '',
    tags: '',
    discountPercent: '',
    new: false,
    colors: [],
    sizes: [],
    stock: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductData({ ...productData, [e.target.name]: e.target.checked });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductData({ ...productData, image: e.target.files[0] });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options).filter(option => option.selected).map(option => option.value);
    setProductData({ ...productData, [name]: selectedValues });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Check if required fields are filled
    if (!productData.name || !productData.price || !productData.slug || !productData.category || !productData.stock) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      let uploadedImageId: string | null = null;

      // Upload image if available
      if (productData.image) {
        try {
          const imageAsset: SanityAssetDocument = await client.assets.upload('image', productData.image);
          uploadedImageId = imageAsset._id;
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image. Please try again.");
          return;
        }
      }

      // Prepare product data for submission
      const productPayload = {
        _type: 'product',  // Assuming your Sanity schema type is 'product'
        name: productData.name,
        price: parseFloat(productData.price as string),
        slug: productData.slug,
        description: productData.description,
        category: productData.category,
        tags: productData.tags,
        discountPercent: parseFloat(productData.discountPercent as string),
        new: productData.new,
        colors: productData.colors,
        sizes: productData.sizes,
        stock: parseInt(productData.stock as string, 10),
        image: uploadedImageId ? { asset: { _ref: uploadedImageId } } : null,
      };

      // Log product data before sending it to Sanity
      console.log("Product Payload:", productPayload);

      // Add the product to Sanity
      await client.create(productPayload);

      alert('Product added successfully!');
      router.push('/product-list'); // Navigate back to the product list
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleCancel = () => {
    setProductData({
      name: '',
      price: '',
      slug: '',
      description: '',
      image: null,
      category: '',
      tags: '',
      discountPercent: '',
      new: false,
      colors: [],
      sizes: [],
      stock: '',
    });
  };

  const handleColorSelection = (color: string) => {
    setProductData(prevState => ({
      ...prevState,
      colors: prevState.colors.includes(color)
        ? prevState.colors.filter(c => c !== color)
        : [...prevState.colors, color],
    }));
  };

  const handleSizeSelection = (size: string) => {
    setProductData(prevState => ({
      ...prevState,
      sizes: prevState.sizes.includes(size)
        ? prevState.sizes.filter(s => s !== size)
        : [...prevState.sizes, size],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-md">
      <h1 className="text-3xl font-bold text-center mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name & Slug */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={productData.name}
              onChange={handleInputChange}
              className="border p-3 rounded w-full"
            />
          </div>
          <div>
            <input
              type="text"
              name="slug"
              placeholder="Product Slug"
              value={productData.slug}
              onChange={handleInputChange}
              className="border p-3 rounded w-full"
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <textarea
              name="description"
              placeholder="Product Description"
              value={productData.description}
              onChange={handleInputChange}
              className="border p-3 rounded w-full"
            />
          </div>

          {/* Price, Category & Tags */}
          <div>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={productData.price}
              onChange={handleInputChange}
              className="border p-3 rounded w-full"
            />
          </div>
          <div>
            <select
              name="category"
              value={productData.category}
              onChange={handleInputChange}
              className="border p-3 rounded w-full"
            >
              <option value="">Select Category</option>
              <option value="tshirt">T-Shirt</option>
              <option value="short">Short</option>
              <option value="jeans">Jeans</option>
              <option value="hoodie">Hoodie</option>
              <option value="shirt">Shirt</option>
            </select>
          </div>
          <div>
            <select
              name="tags"
              value={productData.tags}
              onChange={handleInputChange}
              className="border p-3 rounded w-full"
            >
              <option value="">Select Tags</option>
              <option value="newarrivals">New Arrivals</option>
              <option value="topselling">Top Selling</option>
              <option value="bestselling">Best Selling</option>
            </select>
          </div>

          {/* Discount & Stock */}
          <div>
            <input
              type="number"
              name="discountPercent"
              placeholder="Discount Percent"
              value={productData.discountPercent}
              onChange={handleInputChange}
              className="border p-3 rounded w-full"
            />
          </div>
          <div>
            <input
              type="number"
              name="stock"
              placeholder="Stock Quantity"
              value={productData.stock}
              onChange={handleInputChange}
              className="border p-3 rounded w-full"
            />
          </div>

          {/* Image Upload */}
          <div className="col-span-2">
            <input
              type="file"
              onChange={handleImageUpload}
              className="border p-3 w-full rounded"
            />
            {productData.image && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(productData.image)}
                  alt="Product Image"
                  className="w-full h-60 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* New Product Checkbox */}
          <div className="flex items-center space-x-2 col-span-2">
            <input
              type="checkbox"
              name="new"
              checked={productData.new}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label>New Product</label>
          </div>

          {/* Colors & Sizes */}
          <div className="col-span-2">
            <label className="block mb-2">Select Colors</label>
            <div className="flex gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelection(color)}
                  className={`px-4 py-2 rounded-full ${productData.colors.includes(color) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block mb-2">Select Sizes</label>
            <div className="flex gap-2">
              {sizeOptions.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeSelection(size)}
                  className={`px-4 py-2 rounded-full ${productData.sizes.includes(size) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 col-span-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
