import style from "@/styles/secondSidebar.module.css";

interface TopicOptionsProps {
  isEditEnabled: boolean;
  isFav: boolean;
  isMutating: boolean;
  onOpenDeleteMenu: () => void;
  onEnableEditMode: () => void;
  onConfirmEdit: () => void;
  onCancelEdit: () => void;
  onToggleFav: () => void;
}

export default function TopicOptions({
  isEditEnabled,
  isFav,
  isMutating,
  onOpenDeleteMenu,
  onEnableEditMode,
  onConfirmEdit,
  onCancelEdit,
  onToggleFav,
}: TopicOptionsProps) {
  return (
    <div className={style[`topic-opt`]}>
      {!isEditEnabled && (
        <button
          className={`${style[`del`]} p`}
          title="delete"
          onClick={onOpenDeleteMenu}
        ></button>
      )}
      {!isEditEnabled && (
        <button
          className={`${style[`edit`]} p`}
          title="open edit"
          onClick={onEnableEditMode}
        ></button>
      )}
      {!isEditEnabled && (
        <button
          className={
            isFav ? `${style[`fav`]} ${style[`fav-on`]} p` : `${style[`fav`]} p`
          }
          title="toggle fav"
          onClick={onToggleFav}
          disabled={isMutating}
        ></button>
      )}

      {isEditEnabled && (
        <button
          className={`${style.confirm} p`}
          title="confirm edit"
          onClick={onConfirmEdit}
          disabled={isMutating}
        ></button>
      )}
      {isEditEnabled && (
        <button
          className={`${style.cancel} p`}
          title="cancel edit"
          onClick={onCancelEdit}
        ></button>
      )}
    </div>
  );
}
