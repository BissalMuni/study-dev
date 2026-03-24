"use client";

import { useRef, useState } from "react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

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
