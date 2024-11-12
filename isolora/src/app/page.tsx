"use client";
import { useState } from "react";
import Header from "./components/header";
import ItemList from "./components/itemsList";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Categories for the navbar
  const categories = ["All", "Indian Wear", "Western Wear", "Footwear"];

  // Function to handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="relative">
      {/* Floating Navbar */}
      <Header />

      {/* Hero Banner */}
      <section className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to Isolora</h1>
        <p className="text-lg max-w-2xl text-center">
          Discover a unique collection of fashion and accessories. Shop by category, explore new arrivals, or find the perfect style for any occasion.
          
        </p>
      </section>

      {/* Category Navbar */}
      <nav className="flex justify-center mt-8 space-x-4 bg-white py-4 shadow-md sticky top-0 z-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategorySelect(category)}
            className={`px-4 py-2 rounded-full font-medium ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100"
            }`}
          >
            {category}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center mt-10 min-h-screen">
        {/* Item List with Category Filter */}
        <div className="mt-12 w-full max-w-6xl px-4">
          <ItemList selectedCategory={selectedCategory} />
        </div>
      </main>
    </div>
  );
}

