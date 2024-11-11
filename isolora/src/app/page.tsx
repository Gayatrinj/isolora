"use client"
import { useState } from "react";
import Header from "./components/header";
import ItemList from "./components/itemsList";

export default function Home() {
  const [showMessage, setShowMessage] = useState(false);

  const toggleMessage = () => setShowMessage((prev) => !prev);

  return (
    <div className="relative">
      {/* Floating Navbar */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen mt-20">
        <div className="text-center">
          {/* Toggle Welcome Message Button */}
          <button
            onClick={toggleMessage}
            className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow hover:bg-blue-700 transition duration-300"
          >
            {showMessage ? "Hide Welcome Message" : "Show Welcome Message"}
          </button>

          {/* Welcome Message */}
          {showMessage && (
            <p className="mt-6 text-gray-700 text-lg bg-blue-50 p-6 rounded-lg shadow-lg transition-opacity duration-300 max-w-md mx-auto">
              Welcome to Isolora! We’re excited to bring you something extraordinary. Stay tuned!
            </p>
          )}
        </div>

        {/* Item List */}
        <div className="mt-12 w-full max-w-6xl px-4">
          <ItemList />
        </div>
      </main>
    </div>
  );
}

