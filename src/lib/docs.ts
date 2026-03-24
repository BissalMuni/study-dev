import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DOCS_ROOT = path.join(process.cwd(), "docs");

export interface DocMeta {
  title: string;
  description: string;
  category: string;
  date: string;
  tags: string[];
  slug: string;
}

export interface Doc extends DocMeta {
  content: string;
}

function getMdxFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMdxFiles(fullPath, baseDir));
    } else if (entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }
  return files;
}

export function getAllDocs(): DocMeta[] {
  const files = getMdxFiles(DOCS_ROOT);

  return files
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      const relativePath = path.relative(DOCS_ROOT, filePath);
      const slug = path.basename(filePath, ".mdx");
      const category = path
        .dirname(relativePath)
        .split(path.sep)
        .join("/");

      return {
        title: data.title || slug,
        description: data.description || "",
        category: data.category || category,
        date: data.date || "",
        tags: data.tags || [],
        slug,
      } satisfies DocMeta;
    })
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

export function getDocsByCategory(): Record<string, DocMeta[]> {
  const docs = getAllDocs();
  const grouped: Record<string, DocMeta[]> = {};

  for (const doc of docs) {
    if (!grouped[doc.category]) {
      grouped[doc.category] = [];
    }
    grouped[doc.category].push(doc);
  }

  return grouped;
}

export function getDoc(category: string, slug: string): Doc | null {
  // category can be nested like "dev/backend"
  const filePath = path.join(DOCS_ROOT, category, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    title: data.title || slug,
    description: data.description || "",
    category: data.category || category,
    date: data.date || "",
    tags: data.tags || [],
    slug,
    content,
  };
}

export function getAllDocPaths(): { category: string; slug: string }[] {
  const files = getMdxFiles(DOCS_ROOT);

  return files.map((filePath) => {
    const relativePath = path.relative(DOCS_ROOT, filePath);
    const slug = path.basename(filePath, ".mdx");
    const category = path
      .dirname(relativePath)
      .split(path.sep)
      .join("/");

    return { category, slug };
  });
}
