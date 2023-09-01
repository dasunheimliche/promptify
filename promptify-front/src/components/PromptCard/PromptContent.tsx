import style from "@/styles/prompt.module.css";

interface PromptContentProps {
  onClick: () => void;
  title: string;
  prompt: string;
}

export default function PromptContent({
  onClick,
  title,
  prompt,
}: PromptContentProps) {
  return (
    <div className="p" onClick={onClick}>
      <div className={style.title}>{title}</div>
      <div className={style.content}>{prompt}</div>
    </div>
  );
}
