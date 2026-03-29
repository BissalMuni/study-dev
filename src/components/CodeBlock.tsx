"use client";

import { isValidElement, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Mermaid = dynamic(() => import("./Mermaid"), { ssr: false });

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  // mermaid 코드 블록 감지
  const codeEl = isValidElement(children) ? children : null;
  const codeClass =
    (codeEl?.props as { className?: string })?.className || "";
  if (codeClass.includes("language-mermaid")) {
    const chart = String(
      (codeEl?.props as { children?: string })?.children || ""
    ).trim();
    return <Mermaid chart={chart} />;
  }

  const handleCopy = async () => {
    const text = preRef.current?.textContent || "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre ref={preRef} className={className}>
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="copy-button group-hover:opacity-100"
      >
        {copied ? "복사됨!" : "복사"}
      </button>
    </div>
  );
}
