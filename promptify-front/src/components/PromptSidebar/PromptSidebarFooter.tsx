import style from "@/styles/promptSidebar.module.css";

interface PromptSidebarFooterProps {
  onBack: () => void;
  onForward: () => void;
  currentPrompt: number;
  stackLenght: number | undefined;
}

export default function PromptSidebarFooter({
  onBack,
  onForward,
  currentPrompt,
  stackLenght,
}: PromptSidebarFooterProps) {
  return (
    <div className={style[`content-playback`]}>
      <div className={style.playback} onClick={onBack}>
        {"< "}
      </div>
      <div>{`${currentPrompt}/${stackLenght}`}</div>
      <div className={style.playback} onClick={onForward}>
        {" >"}
      </div>
    </div>
  );
}
