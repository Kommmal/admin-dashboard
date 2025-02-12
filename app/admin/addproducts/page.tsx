"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";

interface Product {
  name: string;
  price: string;
  slug: string;
  description: string;
  image: File | null;
  category: string;
  tags: string;
  discountPercent: string;
  new: boolean;
  colors: string[];
  sizes: string[];
  stock: string;
  sku: string;
}


async function uploadImageToSanity(imageFile: File): Promise<string> {
  try {
    const asset = await client.assets.upload("image", imageFile, {
      filename: imageFile.name,
    });
    console.log("✅ Image uploaded:", asset);
    return asset._id;
  } catch (error) {
    console.error("❌ Error adding product:", error);
    alert(`Failed to add product. Error: ${error}`);
  }
}


const AddProducts = () => {
  const [product, setProduct] = useState<Product>({
    name: "",
    price: "",
    slug: "",
    description: "",
    image: null,
    category: "",
    tags: "",
    discountPercent: "",
    new: false,
    colors: [],
    sizes: [],
    stock: "",
    sku: "",
  });


  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState("Draft");
  const [loading, setLoading] = useState(false);
  const router = useRouter();




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "tags" ? value : value,
    }));
  };


  const toggleSelection = (type: "colors" | "sizes", value: string) => {
    setProduct((prev) => {
      const currentSelection = Array.isArray(prev[type]) ? prev[type] : []; // Ensure it's an array
      const newSelection = currentSelection.includes(value)
        ? currentSelection.filter((item) => item !== value)
        : [...currentSelection, value];

      return {
        ...prev,
        [type]: newSelection,
      };
    });
  };

 



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setProduct((prev) => ({ ...prev, image: file }));
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageRef = "";
      if (product.image instanceof File) {
        try {
          imageRef = await uploadImageToSanity(product.image);
        } catch (error) {
          console.error("❌ Error adding product",  error);
          alert("❌ Failed to upload image. Please try again.");
          setLoading(false);
          return;
        }
      }

      const newProduct = {
        _type: "products",
        name: product.name,
        price: parseFloat(product.price),
        slug: { current: product.slug },
        description: product.description,
        image: imageRef ? { _type: "image", asset: { _ref: imageRef } } : null,
        category: product.category,
        tags: product.tags,
        discountPercent: product.discountPercent ? parseFloat(product.discountPercent) : 0,
        new: product.new,
        colors: product.colors,
        sizes: product.sizes,
        stock: parseInt(product.stock),
        sku: product.sku,
        status: status
      };

      await client.create(newProduct);
      alert("✅ Product added successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("❌ Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='overflow-x-hidden flex flex-col  lg:ml-20 lg:my-8 lg:mr-4 bg-gray-50 border border-gray-100 rounded-lg px-4 py-8'>
      <h1 className='md:text-3xl text-xl font-bold md:font-bold'>Add Product</h1>
      <div className='flex justify-between itens-center mt-2 mb-8'>
        <div className="flex gap-2 items-center">
          <Link href="/admin/dashboard" className=" active:text-gray-400 md:text-lg text-xs ">Dashboard</Link>
          <ChevronDownIcon size={16} color="grey" className="rotate-[-90deg] md:text-lg text-xs" />
          <Link href="/admin/products" className=" active:text-gray-400 md:text-lg text-xs">Product List</Link>
          <ChevronDownIcon size={16} color="grey" className="rotate-[-90deg] md:text-lg text-xs" />
          <Link href="/admin/addproducts" className="  active:text-gray-400 md:text-lg text-xs">Add Product</Link>
        </div>

      </div>
      <form onSubmit={handleSubmit} className="flex lg:flex-row flex-col gap-5">
        <div className='flex flex-col gap-4 lg:w-[70%]'>
          <div className='bg-white flex flex-col gap-4 border border-gray-100 rounded-lg px-4 py-8 '>
            <h1 className='md:text-3xl text-xl font-semibold md:font-semibold '>General Information</h1>
            <div className='' >
              <h1 className='md:font-semibold md:text-[16px] font-semibold text-sm text-gray-500'>Product Name</h1>
              <input type="text" placeholder='Type product name here...' name='name' value={product.name} onChange={handleChange} required className='w-full border border-gray-100 bg-gray-50 p-2 rounded-xl' />
            </div>
            <div className='' >
              <h1 className='md:font-semibold md:text-[16px] font-semibold text-sm text-gray-500'>Slug</h1>
              <input type="text" placeholder='example: black-tshirt' name="slug" value={product.slug} onChange={handleChange} required className='w-full border border-gray-100 bg-gray-50 p-2 rounded-xl  ' />
            </div>
            <div className='' >
              <h1 className='md:font-semibold md:text-[16px] font-semibold text-sm text-gray-500'>Description</h1>
              <textarea rows={7} placeholder='Type product name here...' name="description" value={product.description} onChange={handleChange} required className='w-full border border-gray-100 bg-gray-50 p-2 rounded-xl  ' />
            </div>
          </div>
          <div className='bg-white flex flex-col gap-4 border border-gray-100 rounded-lg px-4 py-8 '>
            <h1 className='md:text-3xl text-xl font-semibold md:font-semibold'>Media</h1>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center w-full max-w-full bg-gray-50 hover:bg-gray-100 transition">
              {imagePreview ? (
                <Image src={imagePreview} alt="Uploaded" className="w-20 h-30 rounded-lg" width={80} height={80} />
              ) : (
                <>
                  <ImageIcon className="w-10 h-10 mb-2" />
                  <p className="text-gray-500">Drag and drop image here, or click add image</p>
                </>
              )}


              <label
                htmlFor="image-upload"
                className="mt-2 px-4 py-2 bg-black text-white rounded-lg cursor-pointer hover:bg-black"
              >
                Add Image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className='bg-white flex flex-col gap-4 border border-gray-100 rounded-lg px-4 py-8 '>
            <h1 className='md:text-3xl text-xl font-semibold md:font-semibold'>Pricing</h1>
            <div className='flex gap-4 md:flex-row flex-col w-full' >
              <div className='md:marker:w-[50%]' >
                <h1 className='md:font-semibold md:text-[16px] font-semibold text-sm text-gray-500' >Base Price</h1>
                <input type="text" placeholder='$ Type price here...' name="price" value={product.price} onChange={handleChange} required className='w-full border border-gray-100 bg-gray-50 p-2 rounded-xl' />
              </div>
              <div className='md:w-[50%]'>
                <h1 className='md:font-semibold md:text-[16px] font-semibold text-sm text-gray-500' >Discount</h1>
                <input type="text" placeholder='Type product discount here...' name="discountPercent" value={product.discountPercent} onChange={handleChange} required className='w-full border border-gray-100 bg-gray-50 p-2 rounded-xl' />
              </div>
            </div>
          </div>
          <div className='bg-white flex flex-col gap-4 border border-gray-100 rounded-lg px-4 py-8 '>
            <h1 className='md:text-3xl text-xl font-semibold md:font-semibold'>Inventory</h1>

            <div className='flex gap-4 md:flex-row flex-col w-full' >
              <div className='md:w-[50%]' >
                <h1 className='md:font-semibold md:text-[16px] font-semibold text-sm text-gray-500' >SKU</h1>
                <input type="text" placeholder='$ Type base SKU here...' name="sku" value={product.sku} onChange={handleChange} required className='w-full border border-gray-100 bg-gray-50 p-2 rounded-xl' />
              </div>
              <div className='md:w-[50%]'>
                <h1 className='md:font-semibold md:text-[16px] font-semibold text-sm text-gray-500' >Quantity</h1>
                <input type="text" placeholder='Type product quantity here...' name="stock" value={product.stock} onChange={handleChange} required className='w-full border border-gray-100 bg-gray-50 p-2 rounded-xl' />
              </div>
            </div>
          </div>
          <div className='bg-white flex flex-col gap-4 border border-gray-100 rounded-lg px-4 py-8 '>
            <h1 className='md:text-3xl text-xl font-semibold md:font-semibold'>Colors & Sizes</h1>
            <div className='flex flex-col gap-2  w-full' >
              <h1 className='md:font-semibold md:text-[16px] font-semibold text-sm text-gray-500'>Colors</h1>
              <div className="flex flex-wrap gap-3 md:text-[16px] text-sm">
                {["Red", "Blue", "Green", "Black", "White"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`p-2 rounded-lg border ${product.colors.includes(color) ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => toggleSelection("colors", color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            <div className='flex flex-col gap-2  w-full'>
              <h1 className='md:font-semibold md:text-[16px] font-semibold text-sm text-gray-500'>Sizes</h1>
              <div className="flex flex-wrap gap-3 md:text-[16px] text-sm">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`px-3 py-2 rounded-lg border ${product.sizes.includes(size) ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => toggleSelection("sizes", size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-[30%] flex gap-4 flex-col">
          <div className='bg-white flex flex-col gap-4 border border-gray-100 rounded-lg px-4 py-8 '>
            <h1 className='md:text-3xl text-xl font-semibold md:font-semibold'>Category</h1>
            <div className='' >
              <h1 className='md:font-semibold md:text-[16px] font-semibold text-sm text-gray-500'>Product Category</h1>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                required
                className="w-full border  border-gray-100 bg-gray-50 p-2 rounded-xl "
              >
                <option value="" className="text-black">Select Category</option>
                <option value="tshirt" className="text-black">T-Shirt</option>
                <option value="short" className="text-black">Short</option>
                <option value="jeans" className="text-black">Jeans</option>
                <option value="hoodie" className="text-black">Hoodie</option>
                <option value="shirt" className="text-black">Shirt</option>
              </select>
            </div>
            <div className='bg-white flex flex-col gap-4 border border-gray-100 rounded-lg px-4 py-8 '>
              <h1 className='md:text-3xl text-xl font-semibold md:font-semibold'>Tags</h1>
              <div className=''>
                <h1 className='md:font-semibold md:text-[16px] font-semibold text-sm text-gray-500'>Product Tags</h1>
                <select
                  name="tags"
                  value={product.tags}
                  onChange={handleChange}
                  className="w-full border border-gray-100 bg-gray-50 p-2 rounded-xl"
                >
                  <option value="newarrival" className="text-black">New Arrival</option>
                  <option value="topselling" className="text-black">Top Selling</option>
                  <option value="bestselling" className="text-black">Best Selling</option>
                </select>
              </div>
            </div>


          </div>
          <div className='bg-white flex flex-col gap-4 border border-gray-100 rounded-lg px-4 py-8 '>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Status</h3>
              <span className="text-sm px-3 py-1 bg-gray-200 text-gray-600 rounded-md">
                {status}
              </span>
            </div>

            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="Draft" >Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          <div className='flex justify-between'>
            <button className='bg-inherit text-gray-400 px-4 py-2 border border-gray-400 rounded-lg'>Cancel</button>
            <button type="submit" disabled={loading} className='bg-black text-white px-4 py-2 border rounded-lg'> {loading ? "Adding..." : "Add Product"}</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddProducts

