import style from "@/styles/popups.module.css";

interface StackOptionsProps {
  isSingle: boolean;
  onNext: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onPrevious: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onAddToStack: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  current: number;
  stackLenght: number;
}

export default function StackOptions({
  isSingle,
  onNext,
  onPrevious,
  onDelete,
  onAddToStack,
  current,
  stackLenght,
}: StackOptionsProps) {
  return (
    <div className={style[`stack-header`]}>
      <div className={style.title}>
        <div className={style.playback}>
          <button
            className={style.goBack}
            title="previous"
            onClick={onPrevious}
          />
          <div>{`${current} of ${stackLenght}`}</div>
          <button className={style.goForward} title="next" onClick={onNext} />
        </div>
      </div>

      <div className={style.options}>
        {isSingle && (
          <button
            className={style.delete}
            title="delete"
            onClick={onDelete}
          ></button>
        )}
        <button className={style.addPrompt} title="add" onClick={onAddToStack}>
          Add +{" "}
        </button>
      </div>
    </div>
  );
}
