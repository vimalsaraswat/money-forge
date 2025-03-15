import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

export const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components: Components = {
    code: ({ className, children, ...props }) => {
      // const match = /language-(\w+)/.exec(className || "");
      // return !inline && match ? (
      //   <pre
      //     {...props}
      //     className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-2 rounded mt-2 dark:bg-zinc-800`}
      //   >
      //     <code className={match[1]}>{children}</code>
      //   </pre>
      // ) : (
      return (
        <code
          className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded`}
          {...props}
        >
          {children}
        </code>
      );
    },
    ol: ({ children, ...props }) => {
      return (
        <ol className="list-decimal list-inside ml-4" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ children, ...props }) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ children, ...props }) => {
      return (
        <ul className="list-decimal list-inside ml-4" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ children, ...props }) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = React.memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
