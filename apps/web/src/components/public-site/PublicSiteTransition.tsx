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
  const navigatingRef = useRef(false);

  useEffect(() => {
    setActive(false);
    navigatingRef.current = false;
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
      if (!sameOrigin || !isPublicSiteLink || navigatingRef.current) return;

      const targetUrl = `${url.pathname}${url.search}${url.hash}`;
      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

      clearTimer();
      setActive(true);
      if (targetUrl === currentUrl || url.hash && url.pathname === window.location.pathname) {
        timeoutRef.current = window.setTimeout(() => setActive(false), 650);
        return;
      }

      event.preventDefault();
      navigatingRef.current = true;
      timeoutRef.current = window.setTimeout(() => {
        window.location.href = targetUrl;
      }, 260);
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
        className={`pointer-events-none fixed inset-0 z-[90] bg-[radial-gradient(circle_at_50%_35%,rgba(217,164,65,0.34),transparent_32%),linear-gradient(135deg,rgba(247,245,238,0.98),rgba(226,242,219,0.94),rgba(255,248,231,0.98))] transition-opacity duration-500 ${
          active ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none fixed left-1/2 top-1/2 z-[91] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-800/25 border-t-emerald-800 transition-opacity duration-200 ${
          active ? "animate-spin opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
