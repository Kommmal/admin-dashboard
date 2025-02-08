"use client";
import { useState } from "react";

export default function Dashboard() {
  const [documentIds, setDocumentIds] = useState("");

  const handleDelete = async () => {
    try {
      const idsArray = documentIds.split(",").map((id) => id.trim()); // Convert input to array

      if (idsArray.length === 0 || idsArray[0] === "") {
        alert("Please enter at least one document ID.");
        return;
      }

      const response = await fetch("/api/deleteDocuments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentIds: idsArray }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        alert(`${data.message}`);
        setDocumentIds(""); // Clear input field after successful deletion
      } else {
        alert("Error deleting documents: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting documents.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-2">Delete Documents</h1>
      <input
        type="text"
        placeholder="Enter Document IDs (comma-separated)"
        value={documentIds}
        onChange={(e) => setDocumentIds(e.target.value)}
        className="border rounded p-2 w-full mb-2"
      />
      <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
        Delete
      </button>
    </div>
  );
}
