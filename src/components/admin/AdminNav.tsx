"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/map", label: "Map" },
  { href: "/admin/themes", label: "Themes" },
  { href: "/admin/compare", label: "Compare" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-canvas-raised">
      <div className="mx-auto flex max-w-content gap-1 overflow-x-auto px-4 sm:px-6">
        {LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                active
                  ? "border-ink text-ink"
                  : "border-transparent text-slate-civic hover:border-line hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <div className="gradient-line" />
    </nav>
  );
}
