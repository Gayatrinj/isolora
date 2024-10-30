// src/app/components/ItemForm.tsx
"use client";

import { useState, useRef } from "react";

// Define the Item and BlobResult interfaces
interface Item {
  name: string;
  category:string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface BlobResult {
  url: string;
}

export default function ItemForm() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];

    // Upload the file to the Vercel Blob API
    const response = await fetch(`/api/product/upload?filename=${file.name}`, {
      method: "POST",
      body: file,
    });

    const blob: BlobResult = await response.json();

    // Set the blob URL after upload
    setBlobUrl(blob.url);

    // Now save item details with the image URL to the database
    const newItem: Item = {
      name,
      category,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      imageUrl: blob.url,
    };

    await fetch("/api/product/add-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });

    alert("Item added successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Item Name"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <input name="file" ref={inputFileRef} type="file" required />
      <button type="submit">Upload Item</button>
      {blobUrl && (
        <p>
          Image uploaded: <a href={blobUrl}>{blobUrl}</a>
        </p>
      )}
    </form>
  );
}
