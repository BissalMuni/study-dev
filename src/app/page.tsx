import Link from "next/link";
import { getDocsByCategory } from "@/lib/docs";

const CATEGORY_LABELS: Record<string, string> = {
  "dev/backend": "Backend",
  "dev/frontend": "Frontend",
  "dev/devops": "DevOps",
  "etc": "기타",
};

export default function HomePage() {
  const docsByCategory = getDocsByCategory();
  const categories = Object.keys(docsByCategory).sort();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">개발 학습 노트</h1>
        <p className="text-[var(--text-secondary)]">
          학습한 내용을 정리하고 기록합니다.
        </p>
      </div>

      {categories.length === 0 && (
        <p className="text-[var(--text-secondary)]">
          아직 작성된 문서가 없습니다. docs/ 폴더에 .mdx 파일을 추가해주세요.
        </p>
      )}

      {categories.map((category) => {
        const docs = docsByCategory[category];
        const label = CATEGORY_LABELS[category] || category;

        return (
          <section key={category} className="mb-10">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-[var(--border-color)]">
              {label}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {docs.map((doc) => (
                <Link
                  key={`${doc.category}/${doc.slug}`}
                  href={`/${doc.category}/${doc.slug}`}
                  className="block p-4 rounded-lg border border-[var(--border-color)] hover:border-[var(--accent)] hover:shadow-sm transition-all group"
                >
                  <h3 className="font-medium mb-1 group-hover:text-[var(--accent)] transition-colors">
                    {doc.title}
                  </h3>
                  {doc.description && (
                    <p className="text-sm text-[var(--text-secondary)] mb-2 line-clamp-2">
                      {doc.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                    {doc.date && <span>{doc.date}</span>}
                    {doc.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {doc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
