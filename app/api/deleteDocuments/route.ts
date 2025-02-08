import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function DELETE(req: Request) {
  try {
    const { documentIds } = await req.json(); // Extract document IDs from request body

    if (!documentIds || documentIds.length === 0) {
      return NextResponse.json({ error: "No document IDs provided" }, { status: 400 });
    }

    // Delete documents from Sanity
    await Promise.all(
      documentIds.map((id: string) => client.delete(id))
    );

    return NextResponse.json({ message: "Documents deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
