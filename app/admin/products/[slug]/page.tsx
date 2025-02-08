"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { Image as ImageIcon } from "lucide-react";

interface Product {
    _id: string;
    name: string;
    price: string;
    slug: string;
    description: string;
    image: string | null;
    category: string;
    tags: string;
    discountPercent: string;
    new: boolean;
    colors: string[];
    sizes: string[];
    stock: string;
    sku: string;
    status: string;
}

const EditProduct = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [status, setStatus] = useState("Draft");
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const query = `*[_type == "products" && slug.current == $slug][0] {
                    _id, name, price, "slug": slug.current, description,
                    "image": image.asset._ref, category, tags, discountPercent,
                    new, colors, sizes, stock, sku, status
                }`;

                const fetchedProduct = await client.fetch(query, { slug });

                if (fetchedProduct) {
                    setProduct({
                        ...fetchedProduct,
                        image: fetchedProduct.image?.asset?._ref || null,
                    });
                    setStatus(fetchedProduct.status || "Draft");
                    if (fetchedProduct.image?.asset?._ref) {
                        setImagePreview(fetchedProduct.image.asset._ref);
                    }
                }
            } catch (error) {
                console.error("❌ Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setProduct((prev) => (prev ? { ...prev, [name]: type === "checkbox" ? checked : value } : prev));
    };

    const toggleSelection = (type: "colors" | "sizes", value: string) => {
        setProduct((prev) =>
            prev
                ? {
                      ...prev,
                      [type]: prev[type].includes(value)
                          ? prev[type].filter((item) => item !== value)
                          : [...prev[type], value],
                  }
                : prev
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!product) return;

        setLoading(true);
        try {
            const updatedProduct = {
                ...product,
                price: parseFloat(product.price),
                discountPercent: parseFloat(product.discountPercent) || 0,
                stock: parseInt(product.stock),
                slug: { current: product.slug },
                status, 
                category: product.category,
                tags: product.tags,
                new: product.new,
                colors: product.colors,
                sizes: product.sizes,
                sku: product.sku,
            };

            await client.patch(product._id).set(updatedProduct).commit();
            alert("✅ Product updated successfully!");
            router.push("/admin/products");
        } catch (error) {
            console.error("❌ Error updating product:", error);
            alert("Failed to update product.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col my-8 mx-4 bg-gray-50 border border-gray-100 rounded-lg px-4 py-8">
            <h1 className="text-4xl font-semibold">Edit Product</h1>
            <form onSubmit={handleSubmit} className="flex gap-5">
                <div className="flex flex-col gap-4 w-[70%]">
                    <div className="bg-white flex flex-col gap-4 border border-gray-100 rounded-lg px-4 py-8">
                        <h1 className="text-2xl font-semibold">General Information</h1>
                        <input
                            type="text"
                            name="name"
                            value={product?.name || ""}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-xl"
                        />
                        <textarea
                            name="description"
                            value={product?.description || ""}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-xl"
                        />
                    </div>

                    <div className="bg-white flex flex-col gap-4 border border-gray-100 rounded-lg px-4 py-8">
                        <h1 className="text-2xl font-semibold">Media</h1>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Uploaded" className="w-20 h-30 rounded-lg" />
                        ) : (
                            <ImageIcon className="w-10 h-10" />
                        )}
                    </div>

                    <div className="bg-white flex flex-col gap-4 border border-gray-100 rounded-lg px-4 py-8">
                        <h1 className="text-2xl font-semibold">Pricing</h1>
                        <input
                            type="text"
                            name="price"
                            value={product?.price || ""}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-xl"
                        />
                        <input
                            type="text"
                            name="discountPercent"
                            value={product?.discountPercent || ""}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-xl"
                        />
                    </div>

                    <div className="bg-white flex flex-col gap-4 border border-gray-100 rounded-lg px-4 py-8">
                        <h1 className="text-2xl font-semibold">Inventory</h1>
                        <input
                            type="text"
                            name="sku"
                            value={product?.sku || ""}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-xl"
                        />
                        <input
                            type="text"
                            name="stock"
                            value={product?.stock || ""}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-xl"
                        />
                    </div>

                    <div className="bg-white flex flex-col gap-4 border border-gray-100 rounded-lg px-4 py-8">
                        <h1 className="text-2xl font-semibold">Colors & Sizes</h1>
                        <div className="flex gap-3">
                            {["Red", "Blue", "Green", "Black", "White"].map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => toggleSelection("colors", color)}
                                    className={`p-2 rounded-lg border ${
                                        product?.colors.includes(color) ? "bg-black text-white" : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-3">
                            {["S", "M", "L", "XL"].map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => toggleSelection("sizes", size)}
                                    className={`p-2 rounded-lg border ${
                                        product?.sizes.includes(size) ? "bg-black text-white" : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-[30%] flex flex-col gap-4">
                    <div className="bg-white flex flex-col gap-4 border border-gray-100 rounded-lg px-4 py-8">
                        <h1 className="text-2xl font-semibold">Category</h1>
                        <select
                            name="category"
                            value={product?.category || ""}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-xl"
                        >
                            <option value="">Select Category</option>
                            <option value="tshirt">T-Shirt</option>
                            <option value="jeans">Jeans</option>
                        </select>
                    </div>

                    <div className="bg-white flex flex-col gap-4 border border-gray-100 rounded-lg px-4 py-8">
                        <h1 className="text-2xl font-semibold">Status</h1>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border p-2 rounded-xl"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </select>
                    </div>

                    <button type="submit" disabled={loading} className="bg-black text-white px-4 py-2 rounded-lg">
                        {loading ? "Updating..." : "Update Product"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
