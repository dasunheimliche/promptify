import style from "@/styles/popups.module.css";

interface EditPromptFooter {
  isMutating: boolean;
  onSaveChanges: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function EditPromptFooter({
  onSaveChanges,
  isMutating,
}: EditPromptFooter) {
  return (
    <div className={style.buttons}>
      <button onClick={onSaveChanges} disabled={isMutating}>
        SAVE
      </button>
    </div>
  );
}
