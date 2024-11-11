"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';  // Import Image component
import { useUser } from "../context/usercontext";
import { useCart } from "../context/cartcontext";

interface CartItem {
  cartid: number;        // Unique identifier for each item in the cart (cart entry ID)
  productId: number;     // The actual product ID from the inventory
  name: string;
  price: string | number;
  quantity: number;
  image_url: string | null;
}

const CartPage = () => {
  const { user } = useUser();
  const { fetchCartCount } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchCartItems = async () => {
      const response = await fetch(`/api/cart/get-items?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        console.log("Fetched cart items:", data.cartItems);
        setCartItems(data.cartItems);
        fetchCartCount();
      } else {
        console.error("Error fetching cart items:", data.message);
      }
    };

    fetchCartItems();
  }, [user, fetchCartCount]);

  const handleRemove = async (productId: number) => {
    if (!user?.id) return;

    console.log("Attempting to remove item with productId:", productId);

    try {
      const response = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          productId: productId,
        }),
      });

      const data = await response.json();
      console.log("Response from remove API:", data);

      if (data.success) {
        setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
        fetchCartCount();
        alert("Item removed from cart.");
      } else {
        console.warn("Error removing item:", data.message);
        alert(data.message || "Error removing item from cart.");
      }
    } catch (error) {
      console.error("Error in handleRemove function:", error);
      alert("An error occurred while removing the item.");
    }
  };

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1 || !user?.id) return;

    try {
      const response = await fetch("/api/cart/update-quantity", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, productId, quantity: newQuantity }),
      });

      const data = await response.json();
      if (data.success) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productId === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        alert("Error updating quantity.");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleBuyRequest = () => {
    alert("Processing your request—we'll be in touch soon.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.cartid} className="flex justify-between items-center border-b border-gray-300 py-4">
            <div className="flex items-center space-x-4">
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  width={64}  // Set a suitable width
                  height={64} // Set a suitable height
                  className="object-cover rounded-md"
                />
              )}
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-700">
                  Price: ${(parseFloat(item.price as string) * item.quantity).toFixed(2)}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 border rounded">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleBuyRequest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Buy
              </button>
              <button
                onClick={() => handleRemove(item.productId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
