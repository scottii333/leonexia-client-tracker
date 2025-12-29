import React from "react";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export const Header = () => {
  return (
    <section
      className="
    flex 
    bg-white
    justify-between 
    items-center
    p-5
    border-b 
    border-b-[#355E34] 
    shadow-md
    sticky
    top-0
    z-50

  "
    >
      <Link href="/dashboard" className="flex items-center gap-1 relative">
        {/* Logo image */}
        <Image
          src="/LeonexiaTransparent.png"
          alt="Leonexia Logo"
          width={40}
          height={40}
          priority
        />

        {/* Text logo with underline effect */}
        <span className="relative inline-block text-[1.5rem] font-semibold after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1.25 after:w-1/2 after:bg-[#355E34]">
          Leonexia
        </span>
      </Link>
      <LogoutButton />
    </section>
  );
};
