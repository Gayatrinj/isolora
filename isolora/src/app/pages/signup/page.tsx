"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [userRole, setUserRole] = useState("customer"); 

  const handleSignup = async () => {
    console.log("Attempting signup with:", {
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      role: userRole,
    });

    try {
      const res = await fetch("/api/user/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          role: userRole,
        }),
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (data.success) {
        alert("Signup successful. Please log in.");
        router.push("/"); 
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred during signup.");
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">Sign Up</h2>
      <form autoComplete="off">
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          className="mb-4 p-2 border rounded w-full text-black"
        >
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
        </select>
        <input
          type="text"
          placeholder="Name"
          value={signupName}
          onChange={(e) => setSignupName(e.target.value)}
          className="mb-4 p-2 border rounded w-full text-black"
        />
        <input
          type="email"
          placeholder="Email"
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
          className="mb-4 p-2 border rounded w-full text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
          className="mb-4 p-2 border rounded w-full text-black"
        />
        <button
          type="button"
          onClick={handleSignup}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          Register
        </button>
      </form>
    </div>
  );
}
