"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

// opening a case or a news story from another page must start at the top of the story,
// not at the scroll position the visitor had on the previous page
export default function ScrollReset() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!(pathname.startsWith("/cases/") || pathname.startsWith("/news/")) || window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
