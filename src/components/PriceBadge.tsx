"use client";

import { useEffect, useState } from "react";

export default function PriceBadge({ label }: { label?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const ls = typeof window !== "undefined" ? localStorage.getItem("gc_logged") : null;
      const ck =
        typeof document !== "undefined" &&
        document.cookie.split(";").some((c) => c.trim().startsWith("gc_logged=1"));
      setShow(ls === "1" || ck === true);
    } catch {
      setShow(false);
    }
  }, []);

  if (!label || !show) return null;

  return (
    <span
      className="inline-block rounded-md px-2 py-1 text-xs font-semibold text-[#1c1c1c]"
      style={{ backgroundImage: "linear-gradient(to bottom, #C9A227, #a8841a)" }}
    >
      {label}
    </span>
  );
}
