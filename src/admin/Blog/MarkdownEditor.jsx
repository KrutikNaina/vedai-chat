import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function MarkdownEditor({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Editor */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-neutral-800 text-sm text-neutral-400">
          ✍ Write (Markdown)
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[400px] bg-transparent p-4 text-sm outline-none resize-none"
          placeholder={`# Blog Title\n\nWrite your content here...\n\n## Example\n- Bullet\n- Points\n\n**Bold** _Italic_\n\n\`\`\`js\nconsole.log("VedAI");\n\`\`\``}
        />
      </div>

      {/* Preview */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-neutral-800 text-sm text-neutral-400">
          👁 Live Preview
        </div>
        <div className="p-4 prose prose-invert max-w-none text-sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {value || "*Start writing to see preview*"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
