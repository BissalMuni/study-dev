import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import CodeBlock from "./CodeBlock";

const components = {
  pre: (props: React.ComponentPropsWithoutRef<"pre">) => (
    <CodeBlock {...props}>{props.children}</CodeBlock>
  ),
};

interface MDXContentProps {
  source: string;
}

export default function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-[var(--accent)] prose-code:before:content-none prose-code:after:content-none">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeHighlight, rehypeSlug],
          },
        }}
      />
    </div>
  );
}
