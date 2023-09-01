import style from "@/styles/popups.module.css";

interface EditPromptHeaderProps {
  mode: "prompt" | "stack";
  onToggleMode: () => void;
  onClose: () => void;
}

export default function EditPromptHeader({
  mode,
  onToggleMode,
  onClose,
}: EditPromptHeaderProps) {
  return (
    <div className={style.header}>
      <div className={style[`header-first`]}>
        <div className={style[`header-title`]}>
          {mode === "prompt" ? "Edit Prompt" : "Edit Stack"}
        </div>
        <button className="p" onClick={onToggleMode}>
          {mode === "prompt" ? "To stack" : "To prompt"}
        </button>
      </div>

      <div className={`${style[`header-close`]} p`} onClick={onClose}>
        ✕
      </div>
    </div>
  );
}
