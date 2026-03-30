"use client";

import { usePathname } from "next/navigation";
import ChatWidget from "./ChatWidget";

export default function ConditionalChatWidget() {
  const pathname = usePathname();
  
  // Không render ChatWidget trong admin area
  if (pathname?.startsWith("/nv-admin-portal")) {
    return null;
  }

  return <ChatWidget />;
}
