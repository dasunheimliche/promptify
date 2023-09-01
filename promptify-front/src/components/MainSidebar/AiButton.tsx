import style from "../../styles/mainSidebar.module.css";

interface AiButtonProps {
  caption: string;
  isActive: boolean | undefined | "";
  onClick: () => void;
}

export default function AiButton({
  caption,
  isActive,
  onClick,
}: AiButtonProps) {
  return (
    <div
      className={
        isActive
          ? `${style[`ai-logo`]} ${style["selected-ai"]} p`
          : `${style[`ai-logo`]} p`
      }
      onClick={onClick}
    >
      {caption}
    </div>
  );
}
