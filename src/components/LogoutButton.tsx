"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import axios, { AxiosError } from "axios";

// --- Types ---
type LogoutResponse = {
  message?: string;
};

const LogoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logoutRequest = async () => {
    return axios.post<LogoutResponse>("/api/logout");
  };

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const res = await logoutRequest();

      if (res.status === 200) {
        toast.success(res.data?.message ?? "Logged out successfully");
        router.replace("/");
        return;
      }

      toast.error(res.data?.message ?? "Failed to log out");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<LogoutResponse>;
      const message =
        axiosError.response?.data?.message ??
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      className="
        h-10
        font-medium
        bg-[#355E34]
        text-white
        hover:bg-[#2c4c2b]
        transition-all
        duration-200
        shadow-sm
        hover:shadow-md
        flex
        items-center
        gap-2
        cursor-pointer
      "
    >
      <LogOut
        size={18}
        className={`transition-all duration-200 ${
          isLoading ? "opacity-50 translate-x-1" : "opacity-100"
        }`}
      />
      {isLoading ? "Logging out…" : "Log out"}
    </Button>
  );
};

export default LogoutButton;
