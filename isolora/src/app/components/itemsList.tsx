
"use client";

import { useEffect, useState } from "react";

interface Item {
  itemid: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    async function fetchItems() {
      const res = await fetch("/api/product/get-items");
      const data = await res.json();
      setItems(data.items);
    }

    fetchItems();
  }, []);

  // Function to delete an item
  const deleteItem = async (itemid: number, imageUrl: string) => {
    const res = await fetch("/api/product/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemid, imageUrl }),
    });

    const data = await res.json();
    if (data.success) {
      setItems((prevItems) => prevItems.filter((item) => item.itemid !== itemid));
      alert("Item deleted successfully");
    } else {
      alert(data.message || "Failed to delete item");
    }
  };

  return (
    <div className="item-list">
      {items.map((item) => (
        <div key={item.itemid} className="item-card">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p>Price: ${item.price}</p>
          <p>Quantity: {item.quantity}</p>
          {item.image_url && <img src={item.image_url} alt={item.name} />}
          <button
            onClick={() => {
              // Only call deleteItem if image_url is not null
              if (item.image_url) {
                deleteItem(item.itemid, item.image_url);
              } else {
                alert("Image URL is missing. Cannot delete item image.");
              }
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
