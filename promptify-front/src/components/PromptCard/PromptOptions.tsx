import style from "@/styles/prompt.module.css";

interface PromptOptionsProps {
  isMutating: boolean;
  isFav: boolean;
  onOpenDeleteMenu: () => void;
  onOpenEditMenu: () => void;
  onToggleFav: () => void;
}

export default function PromptOptions({
  isMutating,
  isFav,
  onOpenDeleteMenu,
  onOpenEditMenu,
  onToggleFav,
}: PromptOptionsProps) {
  return (
    <div className={style.options}>
      <button
        className={`${style.delete} p`}
        title="delete"
        onClick={onOpenDeleteMenu}
      ></button>
      <button
        className={`${style.edit} p`}
        title="edit"
        onClick={onOpenEditMenu}
      ></button>
      <button
        className={
          isFav ? `${style.fav} ${style[`fav-on`]} p` : `${style.fav} p`
        }
        title="add to favs"
        onClick={onToggleFav}
        disabled={isMutating}
      ></button>
    </div>
  );
}
