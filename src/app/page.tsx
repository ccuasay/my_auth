"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome</h1>
        <h6 className="text-2xl font-bold mb-6"></h6>
        <p className="text-neutral-300 mb-10">
          Please choose an option below to continue.
        </p>

        <div className="flex flex-col gap-4">
          <Link href="/login">
            <Button className="bg-black border border-white text-white hover:bg-neutral-800 w-full py-6 text-lg">
              Login
            </Button>
          </Link>

          <Link href="/signup">
            <Button className="bg-black border border-white text-white hover:bg-neutral-800 w-full py-6 text-lg">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
