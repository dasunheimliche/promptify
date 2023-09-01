import { useRef, useEffect } from "react";

import style from "@/styles/secondSidebar.module.css";

interface EditableTopicTitleProps {
  isEditEnabled: boolean;
  title: string;
  newTitle: string;
  onClick: () => void;
  onTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EditableTopicTitle({
  isEditEnabled,
  title,
  newTitle,
  onClick,
  onTyping,
}: EditableTopicTitleProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEditEnabled]);

  return (
    <>
      {!isEditEnabled && (
        <div className={`${style[`topic-name`]} p`} onClick={onClick}>
          {title}
        </div>
      )}
      {isEditEnabled && (
        <input
          ref={inputRef}
          value={newTitle}
          type={"text"}
          placeholder="Edit name"
          className={`${style[`topic-name`]} p unset`}
          onChange={onTyping}
        />
      )}
    </>
  );
}
