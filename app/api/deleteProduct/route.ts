import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function DELETE(req: Request) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await client.delete(productId);

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
