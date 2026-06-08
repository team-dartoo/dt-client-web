import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const splitLooseStrongText = (value) => {
  const parts = [];
  const pattern = /\*\*([^*\n]+?)\*\*/g;
  let index = 0;
  let match;

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > index) {
      parts.push({ type: "text", value: value.slice(index, match.index) });
    }

    parts.push({
      type: "strong",
      children: [{ type: "text", value: match[1] }],
    });

    index = match.index + match[0].length;
  }

  if (index < value.length) {
    parts.push({ type: "text", value: value.slice(index) });
  }

  return parts;
};

const remarkKoreanStrongFallback = () => (tree) => {
  const visit = (node) => {
    if (!node.children) return;

    node.children = node.children.flatMap((child) => {
      if (child.type === "text" && child.value.includes("**")) {
        return splitLooseStrongText(child.value);
      }

      visit(child);
      return child;
    });
  };

  visit(tree);
};

const MarkdownMessage = ({ content }) => {
  if (typeof content !== "string") {
    try {
      return <>{JSON.stringify(content, null, 2)}</>;
    } catch {
      return <>{String(content)}</>;
    }
  }

  return (
    <Markdown remarkPlugins={[remarkGfm, remarkKoreanStrongFallback]}>
      {content}
    </Markdown>
  );
};

export default MarkdownMessage;
