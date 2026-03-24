import { notFound } from "next/navigation";
import Link from "next/link";
import { getDoc, getAllDocPaths } from "@/lib/docs";
import MDXContent from "@/components/MDXContent";

const CATEGORY_LABELS: Record<string, string> = {
  "dev/backend": "Backend",
  "dev/frontend": "Frontend",
  "dev/devops": "DevOps",
  "etc": "기타",
};

interface PageProps {
  params: Promise<{ path: string[] }>;
}

export async function generateStaticParams() {
  const paths = getAllDocPaths();
  return paths.map(({ category, slug }) => ({
    path: [...category.split("/"), slug],
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { path: segments } = await params;
  const slug = segments[segments.length - 1];
  const category = segments.slice(0, -1).join("/");
  const doc = getDoc(category, slug);

  if (!doc) return { title: "Not Found" };

  return {
    title: `${doc.title} - Study Dev`,
    description: doc.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { path: segments } = await params;
  const slug = segments[segments.length - 1];
  const category = segments.slice(0, -1).join("/");
  const doc = getDoc(category, slug);

  if (!doc) {
    notFound();
  }

  const categoryParts = category.split("/");
  const breadcrumbs = categoryParts.map((part, i) => {
    const path = categoryParts.slice(0, i + 1).join("/");
    const label = CATEGORY_LABELS[path] || part;
    return { label, path };
  });

  return (
    <article>
      <nav className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-6">
        <Link href="/" className="hover:text-[var(--accent)] transition-colors">
          홈
        </Link>
        {breadcrumbs.map((crumb) => (
          <span key={crumb.path} className="flex items-center gap-1.5">
            <span>/</span>
            <span>{crumb.label}</span>
          </span>
        ))}
        <span>/</span>
        <span className="text-[var(--text-primary)]">{doc.title}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{doc.title}</h1>
        {doc.description && (
          <p className="text-lg text-[var(--text-secondary)] mb-3">
            {doc.description}
          </p>
        )}
        <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
          {doc.date && <time>{doc.date}</time>}
          {doc.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {doc.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <MDXContent source={doc.content} />
    </article>
  );
}
