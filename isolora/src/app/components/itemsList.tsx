"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/usercontext";
import { useCart } from "../context/cartcontext";
import { ShoppingCartIcon, HeartIcon, TrashIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface Item {
  itemid: number;
  name: string;
  description: string;
  price: number | string;
  quantity: number;
  image_url: string | null;
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [quantityUpdates, setQuantityUpdates] = useState<{ [key: number]: number }>({});
  const { user } = useUser();
  const { addItemToCart } = useCart();

  useEffect(() => {
    async function fetchItems() {
      const res = await fetch("/api/product/get-items");
      const data = await res.json();
      setItems(data.items);
    }
    fetchItems();
  }, []);

  const toggleWishlist = (itemId: number) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(itemId)
        ? prevWishlist.filter((id) => id !== itemId)
        : [...prevWishlist, itemId]
    );
  };

  const handleDelete = async (itemId: number) => {
    alert(`Delete item with ID: ${itemId}`);
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    setQuantityUpdates((prev) => ({ ...prev, [itemId]: newQuantity }));
  };

  const handleUpdateQuantity = async (itemId: number) => {
    const newQuantity = quantityUpdates[itemId];
    if (newQuantity < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    try {
      const response = await fetch("/api/product/update-quantity", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      });

      if (response.ok) {
        alert("Quantity updated successfully.");
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.itemid === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        alert("Failed to update quantity.");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {items.map((item) => (
        <div key={item.itemid} className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center space-y-4 relative">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          {item.image_url && (
            <Image
              src={item.image_url}
              alt={item.name}
              width={200} // Set appropriate width
              height={200} // Set appropriate height
              className="w-full h-48 object-cover rounded-md shadow-sm"
            />
          )}
          <p className="text-gray-600">{item.description}</p>
          <p className="text-gray-700 font-medium">
            Price: ${typeof item.price === "number" ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}
          </p>

          {/* Show different quantity controls based on user role */}
          {user?.role === "vendor" && (
            <div className="flex items-center space-x-4 mt-4">
              <input
                type="number"
                value={quantityUpdates[item.itemid] ?? item.quantity}
                onChange={(e) => handleQuantityChange(item.itemid, parseInt(e.target.value))}
                className="w-16 p-2 border border-gray-300 rounded text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
              />
              <button
                onClick={() => handleUpdateQuantity(item.itemid)}
                className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(item.itemid)}
                className="p-2 rounded-full text-red-600 hover:text-red-700 transition-transform transform hover:scale-110 active:scale-90 duration-200 ease-in-out"
              >
                <TrashIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          )}

          {user?.role !== "vendor" && (
            <div className="flex items-center justify-between w-full mt-4 space-x-4">
              {/* Wishlist button only for customers */}
              <button
                onClick={() => toggleWishlist(item.itemid)}
                className={`p-2 rounded-full ${
                  wishlist.includes(item.itemid) ? "text-red-600" : "text-gray-400"
                } hover:text-red-500 transition-colors duration-200`}
              >
                <HeartIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              <button
                onClick={() => addItemToCart(item.itemid)}
                className="p-2 rounded-full text-blue-500 hover:text-blue-600 transition-transform transform hover:scale-110 active:scale-90 duration-200 ease-in-out"
              >
                <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
