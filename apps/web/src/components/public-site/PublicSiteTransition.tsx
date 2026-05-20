"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function PublicSiteTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setActive(false);
  }, [pathname]);

  useEffect(() => {
    const clearTimer = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      const link = (event.target as Element | null)?.closest("a[href]");
      if (!link) return;

      const href = link.getAttribute("href");
      const target = link.getAttribute("target");
      if (!href || target === "_blank") return;

      const url = new URL(href, window.location.href);
      const sameOrigin = url.origin === window.location.origin;
      const isPublicSiteLink = url.pathname.startsWith("/sites/");
      if (!sameOrigin || !isPublicSiteLink) return;

      clearTimer();
      setActive(true);
      timeoutRef.current = window.setTimeout(() => setActive(false), 650);
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      clearTimer();
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return (
    <div className="relative">
      {children}
      <div
        className={`pointer-events-none fixed inset-0 z-[90] bg-[radial-gradient(circle_at_50%_35%,rgba(217,164,65,0.26),transparent_30%),linear-gradient(135deg,rgba(247,245,238,0.94),rgba(238,246,233,0.88),rgba(255,248,231,0.94))] transition-opacity duration-500 ${
          active ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
