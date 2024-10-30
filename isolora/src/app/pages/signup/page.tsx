
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/usercontext";

export default function AuthForm() {
  const router = useRouter();
  const { setUser } = useUser(); // Access setUser from UserContext
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [userRole, setUserRole] = useState("customer"); 

  const handleLogin = async () => {
    console.log("Attempting login with:", { email, password });

    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (data.success) {
        alert("Login successful.");
        
        // Store the active user data in both localStorage and UserContext
        localStorage.setItem("activeUser", JSON.stringify(data.user));
        setUser(data.user); // Update the context with the logged-in user
        
        router.push("/"); // Redirect after login
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login.");
    }
  };

  const handleSignup = async () => {
    console.log("Attempting signup with:", {
      name: signupName,
      email,
      password,
      role: userRole,
    });

    try {
      const res = await fetch("/api/user/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email,
          password,
          role: userRole,
        }),
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (data.success) {
        alert("Signup successful. Please log in.");
        setIsLogin(true); // Switch to login mode after signup
        router.push("/pages/signup"); // Redirect to login page
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
      <h2 className="text-2xl font-bold mb-4 text-black">
        {isLogin ? "Log In" : "Sign Up"}
      </h2>
      <form autoComplete="off">
        {!isLogin && (
          <>
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
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-2 border rounded w-full text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border rounded w-full text-black"
        />
        <button
          type="button"
          onClick={isLogin ? handleLogin : handleSignup}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          {isLogin ? "Log In" : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 cursor-pointer hover:underline"
        >
          {isLogin ? "Sign up" : "Log in"}
        </span>
      </p>
    </div>
  );
}

