import style from "@/styles/popups.module.css";

interface PromptTitleProps {
  title: string;
  onTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PromptTitle({ title, onTyping }: PromptTitleProps) {
  return (
    <label className={style.title}>
      {"PROMPT TITLE:"}
      <input
        value={title}
        placeholder={"Edit prompt title"}
        onChange={onTyping}
        minLength={1}
        required
      />
    </label>
  );
}
