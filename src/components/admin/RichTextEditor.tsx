"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { uploadMedia } from "./MediaField";

function ToolbarButton({ onClick, active, label, children }: { onClick: () => void; active?: boolean; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn("min-h-9 min-w-9 px-2 text-sm transition-colors", active ? "bg-ink text-paper" : "hover:bg-mist")}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      ul: e.isActive("bulletList"),
      ol: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      code: e.isActive("codeBlock"),
      link: e.isActive("link"),
    }),
  });

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Adresse du lien (laisser vide pour retirer)", previous ?? "https://");
    if (url === null) return;
    if (url === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertImage = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const src = await uploadMedia(file, "articles");
      const alt = window.prompt("Texte alternatif de l'image (accessibilité)", "") ?? "";
      editor.chain().focus().setImage({ src, alt }).run();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Échec de l'envoi");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div role="toolbar" aria-label="Mise en forme" className="sticky top-0 z-10 flex flex-wrap gap-0.5 border-b border-line bg-paper p-1.5">
      <ToolbarButton label="Titre 2" active={s.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
      <ToolbarButton label="Titre 3" active={s.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarButton>
      <span className="mx-1 w-px bg-line" />
      <ToolbarButton label="Gras" active={s.bold} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></ToolbarButton>
      <ToolbarButton label="Italique" active={s.italic} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></ToolbarButton>
      <ToolbarButton label="Lien" active={s.link} onClick={setLink}>↗</ToolbarButton>
      <span className="mx-1 w-px bg-line" />
      <ToolbarButton label="Liste à puces" active={s.ul} onClick={() => editor.chain().focus().toggleBulletList().run()}>• —</ToolbarButton>
      <ToolbarButton label="Liste numérotée" active={s.ol} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</ToolbarButton>
      <ToolbarButton label="Citation" active={s.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>“ ”</ToolbarButton>
      <ToolbarButton label="Bloc de code" active={s.code} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{"</>"}</ToolbarButton>
      <ToolbarButton label="Séparateur" onClick={() => editor.chain().focus().setHorizontalRule().run()}>―</ToolbarButton>
      <ToolbarButton label="Insérer une image" onClick={() => fileRef.current?.click()}>{uploading ? "…" : "Img"}</ToolbarButton>
      <input ref={fileRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={(e) => insertImage(e.target.files?.[0])} />
      <span className="mx-1 w-px bg-line" />
      <ToolbarButton label="Annuler" onClick={() => editor.chain().focus().undo().run()}>↶</ToolbarButton>
      <ToolbarButton label="Rétablir" onClick={() => editor.chain().focus().redo().run()}>↷</ToolbarButton>
    </div>
  );
}

/** Éditeur riche (Tiptap). Le HTML produit est envoyé via un champ caché `name`. */
export default function RichTextEditor({ name, defaultValue, onTextChange }: { name: string; defaultValue?: string; onTextChange?: (html: string) => void }) {
  const [html, setHtml] = useState(defaultValue ?? "");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder: "Commencez à écrire votre article…" }),
    ],
    content: defaultValue ?? "",
    editorProps: {
      attributes: {
        class: "prose-editorial min-h-[420px] px-5 py-6 outline-none sm:px-8",
        "aria-label": "Contenu de l'article",
      },
    },
    onUpdate: ({ editor: e }) => {
      const value = e.getHTML();
      setHtml(value);
      onTextChange?.(value);
    },
  });

  return (
    <div className="border border-line bg-paper focus-within:border-ink">
      {editor ? <Toolbar editor={editor} /> : <div className="h-12 border-b border-line" />}
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
