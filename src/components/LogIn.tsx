"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const LogIn = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        toast.success("Authenticated. Redirecting…");
        router.replace("/dashboard");
      } else {
        toast.error(data?.message ?? "Invalid credentials");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-xl">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6 text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome Back, <span className="text-[#355E34]">Leonexian</span> 👋
            </h1>
            <p className="text-sm text-gray-500">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="h-11 rounded-xl border-gray-300 focus-visible:ring-[#355E34]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 rounded-xl border-gray-300 focus-visible:ring-[#355E34]"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-[#355E34] hover:bg-[#2c4c2b] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
              {isLoading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-xs text-gray-500">
              Use the credentials configured in your environment file.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
