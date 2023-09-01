import style from "@/styles/promptSidebar.module.css";

interface PromptSidebarContent {
  content: string | undefined;
  onTyping: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function PromptSidebarContent({
  content,
  onTyping,
}: PromptSidebarContent) {
  return (
    <textarea
      className={style[`content-textarea`]}
      placeholder="prompt"
      value={content}
      onChange={onTyping}
      spellCheck="false"
    ></textarea>
  );
}
