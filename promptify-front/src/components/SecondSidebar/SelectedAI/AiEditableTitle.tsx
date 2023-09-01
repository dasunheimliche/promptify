import { useRef, useEffect } from "react";

import style from "@/styles/secondSidebar.module.css";

interface EditableAiTitleProps {
  title: string | undefined;
  newTitle: string | undefined;
  isEditEnabled: boolean;
  onTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EditableAiTitle({
  title,
  newTitle,
  isEditEnabled,
  onTyping,
}: EditableAiTitleProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEditEnabled]);

  return (
    <>
      {!isEditEnabled && <div className={style[`ai-title`]}>{title}</div>}
      {isEditEnabled && (
        <input
          ref={inputRef}
          type={"text"}
          value={newTitle}
          placeholder={"edit name"}
          className={`${style[`ai-title`]} unset`}
          onChange={onTyping}
          minLength={1}
        ></input>
      )}
    </>
  );
}
