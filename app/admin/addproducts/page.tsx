"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import axios for HTTP requests
import { client } from "@/sanity/lib/client";
import { Upload } from "lucide-react";

// Function to upload the image to Sanity as a file
async function uploadImageToSanity(imageFile: File): Promise<string> {
  try {
    // Upload the image directly to Sanity as a file
    const asset = await client.assets.upload("image", imageFile, {
      filename: imageFile.name, // Use the file's name
    });

    console.log("Image uploaded successfully:", asset);

    return asset._id; // Return the uploaded image asset reference ID
  } catch (error) {
    console.error("❌ Failed to upload image:", error);
    throw error;
  }
}

const AddProduct = () => {
  const [product, setProduct] = useState({
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
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State to store the image preview URL
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleSelection = (type: "colors" | "sizes", value: string) => {
    setProduct((prev) => {
      const currentSelection = prev[type];
      const newSelection = currentSelection.includes(value)
        ? currentSelection.filter((item) => item !== value) // Remove if already selected
        : [...currentSelection, value]; // Add if not selected
      return {
        ...prev,
        [type]: newSelection,
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Set the preview URL for the uploaded image
      setImagePreview(URL.createObjectURL(file));

      setProduct((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageRef = "";
      if (product.image) {
        try {
          // Upload the image using the helper function that accepts the file object
          imageRef = await uploadImageToSanity(product.image);
          console.log("Image uploaded successfully, reference:", imageRef);
        } catch (error) {
          console.error("Image upload failed:", error);
          alert("Failed to upload image. Please try again.");
        }
      }

      const newProduct = {
        _type: "products",
        name: product.name,
        price: parseFloat(product.price),
        slug: { current: product.slug },
        description: product.description,
        image: imageRef // Directly assigning the image reference
          ? {
              _type: "image",
              asset: {
                _ref: imageRef, // Reference the uploaded image asset
              },
            }
          : undefined, // If no image is uploaded, skip the field
        category: product.category,
        tags: product.tags.split(",").map((tag) => tag.trim()),
        discountPercent: product.discountPercent ? parseFloat(product.discountPercent) : 0,
        new: product.new,
        colors: product.colors,
        sizes: product.sizes,
        stock: parseInt(product.stock),
      };

      await client.create(newProduct);
      alert("Product added successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900 text-center">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg w-full bg-gray-50 text-gray-900 shadow-sm"
          />
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg w-full bg-gray-50 text-gray-900 shadow-sm"
          />
          <input
            type="text"
            name="slug"
            placeholder="Slug"
            value={product.slug}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg w-full bg-gray-50 text-gray-900 shadow-sm"
          />
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg w-full bg-gray-50 text-gray-900 shadow-sm"
          >
            <option value="">Select Category</option>
            <option value="tshirt">T-Shirt</option>
            <option value="short">Short</option>
            <option value="jeans">Jeans</option>
            <option value="hoodie">Hoodie</option>
            <option value="shirt">Shirt</option>
          </select>
          <select
            name="tags"
            value={product.tags}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg w-full bg-gray-50 text-gray-900 shadow-sm"
          >
            <option value="">Select Tags</option>
            <option value="newarrivals">New Arrivals</option>
            <option value="topselling">Top Selling</option>
            <option value="bestselling">Best Selling</option>
          </select>
          <input
            type="number"
            name="discountPercent"
            placeholder="Discount (%)"
            value={product.discountPercent}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full bg-gray-50 text-gray-900 shadow-sm"
          />
          <div className="space-y-2">
            <span className="text-gray-700">Select Colors</span>
            <div className="flex gap-3">
              {["Red", "Blue", "Green", "Black", "White"].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`p-2 rounded-lg border ${
                    product.colors.includes(color) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => toggleSelection("colors", color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-gray-700">Select Sizes</span>
            <div className="flex gap-3">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`p-2 rounded-lg border ${
                    product.sizes.includes(size) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => toggleSelection("sizes", size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={product.stock}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg w-full bg-gray-50 text-gray-900 shadow-sm"
          />
        </div>
        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          required
          className="p-3 border rounded-lg w-full bg-gray-50 text-gray-900 shadow-sm"
        ></textarea>

        {/* Image Upload Section */}
        <label className="block text-gray-700">Upload Image</label>
        <div className="relative flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-gray-500">
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 w-full h-full"
            accept="image/*"
          />
          {imagePreview ? (
            <img src={imagePreview} alt="Image Preview" className="w-32 h-32 object-cover rounded-lg mb-2" />
          ) : (
            <Upload className="w-16 h-16 text-gray-600" />
          )}
          <span className="text-gray-700">Drag & Drop to upload or click to browse</span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
