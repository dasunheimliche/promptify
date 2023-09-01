import style from "@/styles/secondSidebar.module.css";

interface NewTopicInputProps {
  newTopic: string | undefined;
  isShown: boolean;
  isMutating: boolean;
  onOpenInput: () => void;
  onAddTopic: (e: React.FormEvent<HTMLFormElement>) => void;
  onTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function NewTopicInput({
  newTopic,
  isShown,
  onOpenInput,
  onAddTopic,
  onTyping,
  isMutating,
}: NewTopicInputProps) {
  return (
    <div className={style["add-container"]}>
      <div className={style[`add-header`]}>
        <span className={style[`add-title`]}>Topics</span>
        <button className={style[`add-toggle`]} onClick={onOpenInput}>
          {isShown ? "─" : "+"}
        </button>
      </div>

      <form
        className={
          isShown
            ? style[`add-form`]
            : `${style["add-form"]} ${style["hidden-form"]}`
        }
        action=""
        onSubmit={onAddTopic}
      >
        <input
          placeholder="new topic"
          value={newTopic}
          onChange={onTyping}
          minLength={1}
          required
        ></input>
        <button type="submit" disabled={isMutating}>
          ADD
        </button>
      </form>
    </div>
  );
}
