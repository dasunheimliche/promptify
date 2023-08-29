import { Dispatch, useEffect, useRef } from "react";

import { Mains, Topic, User, Visibility } from "@/types";
import style from "../styles/secondSidebar.module.css";

import TopicComponent from "./Topic";

interface ProfileCardProps {
  user: User | undefined;
  onSignOff: () => void;
}

interface AiTitleOptionsProps {
  isEditEnabled: boolean;
  isFav: boolean | undefined;
  isMutating: boolean;
  onClickDelete: () => void;
  onClickEdit: () => void;
  onToggleFav: () => void;
  onConfirmEdit: () => void;
  onCancelEdit: () => void;
}

interface EditableAiTitleProps {
  title: string | undefined;
  newTitle: string | undefined;
  isEditEnabled: boolean;
  onTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface NewTopicInputProps {
  newTopic: string | undefined;
  isShown: boolean;
  isMutating: boolean;
  onOpenInput: () => void;
  onAddTopic: (e: React.FormEvent<HTMLFormElement>) => void;
  onTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface TopicListProps {
  isFav: boolean;
  mains: Mains;
  setMains: Dispatch<Mains>;
  topicList: Topic[] | undefined;
  isMobile: boolean;
  visibility: Visibility;
  setVisibility: Dispatch<Visibility>;
}

interface EditableTopicTitleProps {
  isEditEnabled: boolean;
  title: string;
  newTitle: string;
  onClick: () => void;
  onTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

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

export function Profile({ user, onSignOff }: ProfileCardProps) {
  return (
    <div className={style["profile-card"]}>
      <div className={style["profile-name"]}>{user?.name}</div>
      <button
        className={style["sign-off"]}
        onClick={onSignOff}
        type="button"
        title="Sign off"
      >
        Sign Off
      </button>
    </div>
  );
}

export function EditableAiTitle({
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

export function AiTitleOptions({
  isEditEnabled,
  isFav,
  isMutating,
  onClickDelete,
  onClickEdit,
  onToggleFav,
  onConfirmEdit,
  onCancelEdit,
}: AiTitleOptionsProps) {
  return (
    <div className={style[`ai-options`]}>
      {/* {!isEditEnabled && (
        <button
          className={`${style[`del`]} p`}
          title="delete"
          onClick={onClickDelete}
        />
      )}
      {!isEditEnabled && (
        <button
          className={`${style[`edit`]} p`}
          title="edit"
          onClick={onClickEdit}
        ></button>
      )} */}
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

export function NewTopicInput({
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

export function TopicList({
  isFav = false,
  mains,
  setMains,
  topicList,
  isMobile,
  visibility,
  setVisibility,
}: TopicListProps) {
  const handleClick = (sec: Topic) => {
    setMains({ ...mains, topic: { id: sec.id, aiId: sec.aiId } });

    if (isMobile) {
      setVisibility({ ...visibility, showSS: false });
    }
  };

  const newTopicList = topicList?.filter((t: Topic) =>
    isFav ? t?.fav !== false : t?.fav === false
  );

  return (
    <div className={style.topics}>
      {newTopicList?.map((sec: Topic, i: number) => (
        <TopicComponent
          key={i}
          sec={sec}
          topicList={topicList}
          mains={mains}
          onClick={() => handleClick(sec)}
          setMains={setMains}
        />
      ))}
    </div>
  );
}

export function EditableTopicTitle({
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

export function TopicOptions({
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
