"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Palette,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Trash2,
  Underline as UnderlineIcon,
  Undo2
} from "lucide-react";
import toast from "react-hot-toast";

const textColors = [
  { label: "Ink", value: "#1a1209" },
  { label: "Accent", value: "#c8440a" },
  { label: "Blue", value: "#2563eb" },
  { label: "Green", value: "#15803d" },
  { label: "Rose", value: "#be123c" },
  { label: "Violet", value: "#7c3aed" }
];

const highlightColors = [
  { label: "Yellow", value: "#fef3c7" },
  { label: "Orange", value: "#fed7aa" },
  { label: "Green", value: "#bbf7d0" },
  { label: "Blue", value: "#bfdbfe" },
  { label: "Rose", value: "#fecdd3" }
];

function Tool({ active, onClick, children, label, loading, compact = false }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      disabled={loading}
      data-active={active ? "true" : "false"}
      className={`rich-editor-tool ${compact ? "rich-editor-tool-compact" : ""}`}
    >
      {children}
    </button>
  );
}

function Swatch({ color, label, active, onClick, compact = false }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      data-active={active ? "true" : "false"}
      className={`rich-editor-swatch ${compact ? "rich-editor-swatch-compact" : ""}`}
    >
      <span style={{ backgroundColor: color }} />
    </button>
  );
}

function Group({ children }) {
  return <div className="rich-editor-group">{children}</div>;
}

export default function RichEditor({ value, onChange }) {
  const imageInputRef = useRef(null);
  const editorShellRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const [selectionMenu, setSelectionMenu] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TiptapImage,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write the story..." })
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from === to) {
        setSelectionMenu(null);
        return;
      }

      requestAnimationFrame(() => {
        try {
          const start = editor.view.coordsAtPos(from);
          const end = editor.view.coordsAtPos(to);
          const left = (start.left + end.right) / 2;
          const top = Math.max(12, Math.min(start.top, end.top) - 12);
          setSelectionMenu({ left, top });
        } catch {
          setSelectionMenu(null);
        }
      });
    },
    onBlur: ({ event }) => {
      if (event?.relatedTarget?.closest?.(".rich-editor-floating")) return;
      setSelectionMenu(null);
      setOpenPanel(null);
    }
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    const hide = () => setSelectionMenu(null);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [editor]);

  if (!editor) return <div className="rounded-lg border bg-white p-6">Loading editor...</div>;

  const selectedColor = editor.getAttributes("textStyle").color;
  const selectedHighlight = editor.getAttributes("highlight").color;
  const wordCount = editor.getText().trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const run = (callback) => {
    callback();
    editor.commands.focus();
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    const url = prompt("Paste URL", previousUrl);
    if (url === null) return;
    if (!url.trim()) {
      run(() => editor.chain().focus().unsetLink().run());
      return;
    }
    run(() => editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run());
  };

  const addImageURL = () => {
    const url = prompt("Paste image URL");
    if (url) run(() => editor.chain().focus().setImage({ src: url.trim() }).run());
  };

  const uploadImage = async (file) => {
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (res.ok && data.url) {
      run(() => editor.chain().focus().setImage({ src: data.url }).run());
      toast.success("Image inserted");
    } else {
      toast.error(data.message || "Upload failed");
    }
  };

  const ColorPanel = ({ type, compact = false }) => {
    const colors = type === "text" ? textColors : highlightColors;
    const activeColor = type === "text" ? selectedColor : selectedHighlight;
    const reset = type === "text"
      ? () => run(() => editor.chain().focus().unsetColor().run())
      : () => run(() => editor.chain().focus().unsetHighlight().run());

    return (
      <div className="rich-editor-colors">
        {colors.map((item) => (
          <Swatch
            key={item.value}
            color={item.value}
            label={item.label}
            compact={compact}
            active={activeColor === item.value}
            onClick={() => run(() => {
              const chain = editor.chain().focus();
              if (type === "text") chain.setColor(item.value).run();
              else chain.toggleHighlight({ color: item.value }).run();
            })}
          />
        ))}
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={reset} className="rich-editor-reset" aria-label="Reset color" title="Reset color">
          x
        </button>
      </div>
    );
  };

  const Toolbar = () => (
    <div className="rich-editor-toolbar">
      <Group>
        <Tool label="Undo" onClick={() => run(() => editor.chain().focus().undo().run())}><Undo2 size={18} /></Tool>
        <Tool label="Redo" onClick={() => run(() => editor.chain().focus().redo().run())}><Redo2 size={18} /></Tool>
      </Group>
      <Group>
        <Tool label="Bold" active={editor.isActive("bold")} onClick={() => run(() => editor.chain().focus().toggleBold().run())}><Bold size={18} /></Tool>
        <Tool label="Italic" active={editor.isActive("italic")} onClick={() => run(() => editor.chain().focus().toggleItalic().run())}><Italic size={18} /></Tool>
        <Tool label="Underline" active={editor.isActive("underline")} onClick={() => run(() => editor.chain().focus().toggleUnderline().run())}><UnderlineIcon size={18} /></Tool>
        <Tool label="Strikethrough" active={editor.isActive("strike")} onClick={() => run(() => editor.chain().focus().toggleStrike().run())}><Strikethrough size={18} /></Tool>
        <Tool label="Clear formatting" onClick={() => run(() => editor.chain().focus().unsetAllMarks().clearNodes().run())}><RemoveFormatting size={18} /></Tool>
      </Group>
      <Group>
        <Tool label="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => run(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}><Heading1 size={18} /></Tool>
        <Tool label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => run(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}><Heading2 size={18} /></Tool>
        <Tool label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => run(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}><Heading3 size={18} /></Tool>
      </Group>
      <Group>
        <Tool label="Bullet list" active={editor.isActive("bulletList")} onClick={() => run(() => editor.chain().focus().toggleBulletList().run())}><List size={18} /></Tool>
        <Tool label="Ordered list" active={editor.isActive("orderedList")} onClick={() => run(() => editor.chain().focus().toggleOrderedList().run())}><ListOrdered size={18} /></Tool>
        <Tool label="Blockquote" active={editor.isActive("blockquote")} onClick={() => run(() => editor.chain().focus().toggleBlockquote().run())}><Quote size={18} /></Tool>
        <Tool label="Divider line" onClick={() => run(() => editor.chain().focus().setHorizontalRule().run())}><Minus size={18} /></Tool>
      </Group>
      <Group>
        <Tool label="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => run(() => editor.chain().focus().setTextAlign("left").run())}><AlignLeft size={18} /></Tool>
        <Tool label="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => run(() => editor.chain().focus().setTextAlign("center").run())}><AlignCenter size={18} /></Tool>
        <Tool label="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => run(() => editor.chain().focus().setTextAlign("right").run())}><AlignRight size={18} /></Tool>
        <Tool label="Justify" active={editor.isActive({ textAlign: "justify" })} onClick={() => run(() => editor.chain().focus().setTextAlign("justify").run())}><AlignJustify size={18} /></Tool>
      </Group>
      <Group>
        <div className="rich-editor-popover">
          <Tool label="Text color" active={openPanel === "text"} onClick={() => setOpenPanel(openPanel === "text" ? null : "text")}><Palette size={18} /></Tool>
          {openPanel === "text" && <ColorPanel type="text" />}
        </div>
        <div className="rich-editor-popover">
          <Tool label="Highlight" active={openPanel === "highlight"} onClick={() => setOpenPanel(openPanel === "highlight" ? null : "highlight")}><Highlighter size={18} /></Tool>
          {openPanel === "highlight" && <ColorPanel type="highlight" />}
        </div>
      </Group>
      <Group>
        <Tool label="Link" active={editor.isActive("link")} onClick={addLink}><LinkIcon size={18} /></Tool>
        <Tool label="Remove link" onClick={() => run(() => editor.chain().focus().unsetLink().run())}><Trash2 size={18} /></Tool>
        <Tool label="Upload image" loading={uploading} onClick={() => imageInputRef.current?.click()}><ImageIcon size={18} /></Tool>
        <Tool label="Image URL" onClick={addImageURL}><LinkIcon size={18} /></Tool>
        <Tool label="Code block" active={editor.isActive("codeBlock")} onClick={() => run(() => editor.chain().focus().toggleCodeBlock().run())}><Code size={18} /></Tool>
      </Group>
    </div>
  );

  const FloatingMenu = () => {
    if (!selectionMenu) return null;
    return (
      <div
        className="rich-editor-floating"
        style={{ left: selectionMenu.left, top: selectionMenu.top }}
        onMouseDown={(event) => event.preventDefault()}
      >
        <Tool compact label="Bold" active={editor.isActive("bold")} onClick={() => run(() => editor.chain().focus().toggleBold().run())}><Bold size={16} /></Tool>
        <Tool compact label="Italic" active={editor.isActive("italic")} onClick={() => run(() => editor.chain().focus().toggleItalic().run())}><Italic size={16} /></Tool>
        <Tool compact label="Underline" active={editor.isActive("underline")} onClick={() => run(() => editor.chain().focus().toggleUnderline().run())}><UnderlineIcon size={16} /></Tool>
        <Tool compact label="Link" active={editor.isActive("link")} onClick={addLink}><LinkIcon size={16} /></Tool>
        <span className="rich-editor-floating-divider" />
        <ColorPanel type="text" compact />
        <span className="rich-editor-floating-divider" />
        <ColorPanel type="highlight" compact />
      </div>
    );
  };

  return (
    <div ref={editorShellRef} className="rich-editor rounded-lg border border-stone-200 bg-white">
      <Toolbar />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => uploadImage(event.target.files[0])}
      />
      <EditorContent editor={editor} className="prose-blog rich-editor-content max-w-none p-5" />
      <FloatingMenu />
      <div className="rich-editor-status flex flex-wrap items-center justify-end gap-2 border-t border-stone-200 p-3 text-xs text-stone-500">
        <span>{wordCount} words - about {readingTime} min read</span>
      </div>
    </div>
  );
}
