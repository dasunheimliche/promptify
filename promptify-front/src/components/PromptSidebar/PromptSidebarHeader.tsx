import style from "@/styles/promptSidebar.module.css";

interface PromptSidebarHeaderProps {
  isEdited: boolean;
  onHideSidebar: () => void;
  onRestart: () => void;
  onClearPrompt: () => void;
  onCopyPrompt: () => void;
}

export default function PromptSidebarHeader({
  isEdited,
  onHideSidebar,
  onRestart,
  onClearPrompt,
  onCopyPrompt,
}: PromptSidebarHeaderProps) {
  return (
    <div className={style.header}>
      <span
        className={`${style[`back-button`]} p`}
        onClick={onHideSidebar}
      ></span>
      <div className={style.buttons}>
        <button
          className={isEdited ? `p ${style.update}` : `p`}
          onClick={onRestart}
        >
          {isEdited ? "UPDATE" : "RESTART"}
        </button>
        <button className="p" onClick={onClearPrompt}>
          CLEAR
        </button>
        <button className="p" onClick={onCopyPrompt}>
          COPY
        </button>
      </div>
    </div>
  );
}
