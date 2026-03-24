import type { Metadata } from "next";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { getDocsByCategory } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Study Dev - 개발 학습 노트",
  description: "개발 학습 노트 사이트",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docsByCategory = getDocsByCategory();

  const sidebarDocs: Record<string, { title: string; slug: string; category: string }[]> = {};
  for (const [cat, docs] of Object.entries(docsByCategory)) {
    sidebarDocs[cat] = docs.map((d) => ({
      title: d.title,
      slug: d.slug,
      category: d.category,
    }));
  }

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        <div className="flex min-h-screen">
          <Sidebar docs={sidebarDocs} />
          <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-10 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-sm">
              <div className="flex items-center justify-between px-6 py-3">
                <h1 className="text-sm font-medium text-[var(--text-secondary)]">
                  개발 학습 노트
                </h1>
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1 px-6 py-8 max-w-4xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
