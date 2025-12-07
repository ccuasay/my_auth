"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { saveToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE } from "@/lib/config";

// ICONS
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    saveToken(data.accessToken);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex bg-black">
      {/* LEFT SIDE PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-12 bg-black text-white">
        <div className="max-w-sm w-full">

          <h1 className="text-3xl font-bold mb-2">Welcome</h1>
          <p className="text-sm text-gray-400 mb-6">Sign in to continue</p>

          {/* GOOGLE BUTTON */}
          <Button
            className="w-full bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 flex items-center justify-center gap-2"
            onClick={() => console.log("Google login")}
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>

          {/* FACEBOOK BUTTON */}
          <Button
            className="w-full mt-3 bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 flex items-center justify-center gap-2"
            onClick={() => console.log("Facebook login")}
          >
            <FaFacebook className="w-5 h-5 text-blue-500" />
            Continue with Facebook
          </Button>

          {/* GITHUB BUTTON */}
          <Button
            className="w-full mt-3 bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 flex items-center justify-center gap-2"
            onClick={() => console.log("GitHub login")}
          >
            <FaGithub className="w-5 h-5" />
            Continue with GitHub
          </Button>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-neutral-700 w-full"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="h-px bg-neutral-700 w-full"></div>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-4">

            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-neutral-900 border-neutral-700 text-white"
            />

            <Input
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-neutral-900 border-neutral-700 text-white"
            />

            {/* FORGOT PASSWORD */}
            <div className="text-right -mt-2">
              <button
                type="button"
                className="text-blue-400 text-sm hover:underline"
                
              >
                Forgot Password?
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              className="w-full bg-white text-black hover:bg-gray-300"
              type="submit"
            >
              Continue
            </Button>
          </form>

          {/* SIGN UP LINK */}
          <p className="text-sm text-gray-400 mt-6 text-center">
            Don’t have an account?{" "}
            <button
              type="button"
              className="text-white underline"
              onClick={() => router.push("/register")}
            >
              Sign up
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
