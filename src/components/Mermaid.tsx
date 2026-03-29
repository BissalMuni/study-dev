"use client";

import { useEffect, useState } from "react";
import mermaid from "mermaid";

export default function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose",
    });

    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    mermaid.render(id, chart).then(({ svg }) => setSvg(svg));
  }, [chart]);

  // 다크모드 토글 시 다이어그램 재렌더링
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "default",
        securityLevel: "loose",
      });
      const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
      mermaid.render(id, chart).then(({ svg }) => setSvg(svg));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [chart]);

  return (
    <div
      className="not-prose my-6 flex justify-center overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
