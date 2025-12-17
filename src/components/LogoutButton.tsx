"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LogoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onLogout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out");
        router.replace("/");
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? "Failed to log out");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={onLogout} disabled={isLoading}>
      {isLoading ? "Logging out…" : "Log out"}
    </Button>
  );
};

export default LogoutButton;
