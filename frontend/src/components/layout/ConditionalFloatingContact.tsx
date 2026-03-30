"use client";

import { usePathname } from "next/navigation";
import { FloatingContact } from "./FloatingContact";

export default function ConditionalFloatingContact() {
  const pathname = usePathname();
  if (pathname?.startsWith("/nv-admin-portal")) return null;
  return <FloatingContact />;
}
