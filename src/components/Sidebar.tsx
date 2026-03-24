"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface DocItem {
  title: string;
  slug: string;
  category: string;
}

interface SidebarProps {
  docs: Record<string, DocItem[]>;
}

const CATEGORY_LABELS: Record<string, string> = {
  "dev/backend": "Backend",
  "dev/frontend": "Frontend",
  "dev/devops": "DevOps",
  "etc": "기타",
};

export default function Sidebar({ docs }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const categories = Object.keys(docs).sort();

  return (
    <nav className="w-64 shrink-0 border-r border-[var(--border-color)] bg-[var(--bg-sidebar)] h-screen sticky top-0 overflow-y-auto">
      <div className="p-4">
        <Link href="/" className="block text-lg font-bold mb-6 hover:text-[var(--accent)] transition-colors">
          Study Dev
        </Link>

        <div className="space-y-1">
          {categories.map((category) => {
            const isCollapsed = collapsed[category];
            const items = docs[category];
            const label = CATEGORY_LABELS[category] || category;

            return (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex items-center justify-between w-full px-2 py-1.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded transition-colors"
                >
                  <span>{label}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isCollapsed ? "" : "rotate-90"}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {!isCollapsed && (
                  <div className="ml-2 space-y-0.5">
                    {items.map((doc) => {
                      const href = `/${doc.category}/${doc.slug}`;
                      const isActive = pathname === href;

                      return (
                        <Link
                          key={doc.slug}
                          href={href}
                          className={`block px-3 py-1.5 text-sm rounded transition-colors ${
                            isActive
                              ? "bg-[var(--accent-light)] text-[var(--accent)] font-medium"
                              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {doc.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
