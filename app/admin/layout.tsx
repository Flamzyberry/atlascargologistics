"use client";

import { useEffect } from "react";

// Admin routes wrapper - individual pages will use AdminLayout as needed
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hide Smartsupp chat widget in admin pages
  useEffect(() => {
    const hideChat = () => {
      // Hide Smartsupp widget
      if (typeof window !== "undefined" && (window as any).smartsupp) {
        (window as any).smartsupp("chat:hide");
      }
      // Also hide via CSS as fallback
      const style = document.createElement("style");
      style.id = "hide-smartsupp-admin";
      style.innerHTML = `
        #smartsupp-widget-container,
        .smartsupp-widget-container,
        [id^="chat-application"] {
          display: none !important;
        }
      `;
      if (!document.getElementById("hide-smartsupp-admin")) {
        document.head.appendChild(style);
      }
    };

    // Run immediately and after a delay (widget may load async)
    hideChat();
    const timeout = setTimeout(hideChat, 1000);
    const interval = setInterval(hideChat, 2000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      // Remove style when leaving admin
      const style = document.getElementById("hide-smartsupp-admin");
      if (style) style.remove();
      // Show chat again when leaving admin
      if (typeof window !== "undefined" && (window as any).smartsupp) {
        (window as any).smartsupp("chat:show");
      }
    };
  }, []);

  return <>{children}</>;
}
