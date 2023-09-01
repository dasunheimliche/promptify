import style from "@/styles/secondSidebar.module.css";

interface AiTitleOptionsProps {
  isEditEnabled: boolean;
  isFav: boolean | undefined;
  isMutating: boolean;
  onToggleFav: () => void;
  onConfirmEdit: () => void;
  onCancelEdit: () => void;
}

export default function AiTitleOptions({
  isEditEnabled,
  isFav,
  isMutating,
  onToggleFav,
  onConfirmEdit,
  onCancelEdit,
}: AiTitleOptionsProps) {
  return (
    <div className={style[`ai-options`]}>
      {!isEditEnabled && (
        <button
          className={
            isFav ? `${style[`fav`]} ${style[`fav-on`]} p` : `${style[`fav`]} p`
          }
          title="add to fav"
          onClick={onToggleFav}
          disabled={isMutating}
        ></button>
      )}

      {isEditEnabled && (
        <button
          className={`${style.confirm} p`}
          title="accept"
          onClick={onConfirmEdit}
          disabled={isMutating}
        ></button>
      )}
      {isEditEnabled && (
        <button
          className={`${style.cancel} p`}
          title="cancel"
          onClick={onCancelEdit}
        ></button>
      )}
    </div>
  );
}
