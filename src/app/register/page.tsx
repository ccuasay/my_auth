"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE } from "@/lib/config";

// ICONS
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        username,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Registration failed");
      return;
    }

    setSuccess("Account created successfully!");
    setTimeout(() => router.push("/login"), 1000);
  }

  return (
    <div className="min-h-screen flex bg-black">
      {/* LEFT SIDE PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-12 bg-black text-white">
        <div className="max-w-sm w-full">

          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-sm text-gray-400 mb-6">Sign up to get started</p>

          {/* SOCIAL BUTTONS */}
          <Button className="w-full bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 flex items-center justify-center gap-2">
            <FcGoogle className="w-5 h-5" />
            Sign up with Google
          </Button>

          <Button className="w-full mt-3 bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 flex items-center justify-center gap-2">
            <FaFacebook className="w-5 h-5 text-blue-500" />
            Sign up with Facebook
          </Button>

          <Button className="w-full mt-3 bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 flex items-center justify-center gap-2">
            <FaGithub className="w-5 h-5" />
            Sign up with GitHub
          </Button>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-neutral-700 w-full"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="h-px bg-neutral-700 w-full"></div>
          </div>

          {/* REGISTER FORM */}
          <form onSubmit={handleRegister} className="space-y-4">

            <Input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-neutral-900 border-neutral-700 text-white"
            />

            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-neutral-900 border-neutral-700 text-white"
            />

            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-neutral-900 border-neutral-700 text-white"
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-neutral-900 border-neutral-700 text-white"
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}

            <Button className="w-full bg-white text-black hover:bg-gray-300" type="submit">
              Create Account
            </Button>
          </form>

          <p className="text-sm text-gray-400 mt-6 text-center">
            Already have an account?{" "}
            <button
              type="button"
              className="text-white underline"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div
        className="hidden lg:block w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/X01-removebg-preview.png')",
        }}
      ></div>
    </div>
  );
}
