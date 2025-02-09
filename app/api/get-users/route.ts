import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await clerkClient.users.getUserList({
      limit: 50, 

    });

    const users = response.data; // ✅ Access the `data` array

    console.log("Fetched Users:", users); // Debugging log

    if (!users || users.length === 0) {
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
