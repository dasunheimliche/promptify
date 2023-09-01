import style from "@/styles/popups.module.css";

interface StackTitleProps {
  mode: "prompt" | "stack";
  title: string;
  onTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StackTitle({ mode, title, onTyping }: StackTitleProps) {
  return (
    <label className={style.title}>
      {mode === "prompt" ? "TITLE:" : "STACK TITLE:"}
      <input
        value={title}
        type="text"
        placeholder="title"
        onChange={onTyping}
        minLength={1}
        required
      />
    </label>
  );
}
