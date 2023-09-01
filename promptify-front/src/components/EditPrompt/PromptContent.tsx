import style from "@/styles/popups.module.css";

interface PromptContentProps {
  content: string;
  onTyping: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function PromptContent({
  content,
  onTyping,
}: PromptContentProps) {
  return (
    <label htmlFor="" className={style.title}>
      {"PROMPT CONTENT:"}
      <textarea
        value={content}
        placeholder="Write your prompt"
        onChange={onTyping}
        minLength={1}
        required
      />
    </label>
  );
}
