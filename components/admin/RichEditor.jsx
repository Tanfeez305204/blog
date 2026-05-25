"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Code, Heading1, Heading2, Heading3, Image, Italic, Link as LinkIcon, List, ListOrdered, Quote, Underline as UnderlineIcon } from "lucide-react";

function Tool({ active, onClick, children, label }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className={`rounded border p-2 ${active ? "border-accent bg-orange-50 text-accent" : "border-stone-200 bg-white"}`}>
      {children}
    </button>
  );
}

export default function RichEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TiptapImage,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write the story..." })
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML())
  });

  if (!editor) return <div className="rounded-lg border bg-white p-6">Loading editor...</div>;

  const addLink = () => {
    const url = prompt("Paste URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };
  const addImage = () => {
    const url = prompt("Paste image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="rounded-lg border border-stone-200 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-stone-200 p-3">
        <Tool label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={17} /></Tool>
        <Tool label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={17} /></Tool>
        <Tool label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={17} /></Tool>
        <Tool label="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={17} /></Tool>
        <Tool label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={17} /></Tool>
        <Tool label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={17} /></Tool>
        <Tool label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={17} /></Tool>
        <Tool label="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={17} /></Tool>
        <Tool label="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={17} /></Tool>
        <Tool label="Link" active={editor.isActive("link")} onClick={addLink}><LinkIcon size={17} /></Tool>
        <Tool label="Image" onClick={addImage}><Image size={17} /></Tool>
        <Tool label="Code" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code size={17} /></Tool>
      </div>
      <EditorContent editor={editor} className="prose-blog max-w-none p-5" />
    </div>
  );
}
