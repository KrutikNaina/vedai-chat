import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function BlogEditor({ value, onChange }) {
  const insert = (text) => {
    onChange(value + text);
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 bg-neutral-900 border border-neutral-800 rounded-xl p-2">
        <button onClick={() => insert("\n# Heading\n")} className="editor-btn">H1</button>
        <button onClick={() => insert("**bold**")} className="editor-btn">Bold</button>
        <button onClick={() => insert("_italic_")} className="editor-btn">Italic</button>
        <button onClick={() => insert("\n- List item")} className="editor-btn">List</button>
        <button onClick={() => insert("\n```js\ncode\n```")} className="editor-btn">Code</button>
        <button onClick={() => insert("\n![Alt text](image-url)")} className="editor-btn">Image</button>
        <button onClick={() => insert("\n> Quote")} className="editor-btn">Quote</button>
      </div>

      {/* Editor + Preview */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Editor */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-[420px] bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-sm resize-none"
          placeholder="Write blog content in Markdown..."
        />

        {/* Live Preview */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 overflow-y-auto prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {value || "*Live preview will appear here*"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
