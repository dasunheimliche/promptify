import { Dispatch, useState } from "react";

import { Card, Prompt } from "@/types";
import { doNothing } from "@/utils/functions";

import { useMutation } from "@apollo/client";
import { EDIT_CARD } from "@/queries";
import { Mains } from "@/types";

import style from "../styles/popups.module.css";
import {
  EditPromptFooter,
  EditPromptHeader,
  PromptContent,
  PromptTitle,
  StackOptions,
  StackTitle,
} from "./EditPromptModule";

interface EditPRomptProps {
  card: Card;
  mains: Mains;
  setMains: Dispatch<Mains>;
  setEdit: Dispatch<boolean>;
}

type mode = "stack" | "prompt";

const EditPrompt = ({ card, mains, setEdit, setMains }: EditPRomptProps) => {
  const [mode, setMode] = useState<mode>(
    card.prompts.length > 1 ? "stack" : "prompt"
  );
  const [newTitle, setNewTitle] = useState<string>(card.title);
  const [newPrompts, setNewPrompts] = useState<Prompt[]>(card.prompts);
  const [index, setIndex] = useState<number>(0);

  console.log("CURRENT INDEX: ", index);

  const [editCard, { loading }] = useMutation(EDIT_CARD);

  const confirmEdit = () => {
    return;
  };

  const close = () => {
    setEdit(false);
  };

  const setModeHandler = () => {
    if (mode === "prompt") {
      setMode("stack");
    } else {
      setIndex(0);
      setMode("prompt");
    }
  };

  const goBack = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (index - 1 < 0) return;
    setIndex(index - 1);
  };

  const goForward = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (index + 1 > newPrompts.length - 1) {
      return;
    }

    setIndex(index + 1);
  };

  const editPromptTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prompts = [...newPrompts];
    prompts[index] = { ...prompts[index], title: e.target.value };
    setNewPrompts(prompts);
  };

  const editPromptContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const prompts = [...newPrompts];
    prompts[index] = { ...prompts[index], content: e.target.value };
    setNewPrompts(prompts);
  };

  const editCardHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    let promptsWithoutTypename = newPrompts.map(
      ({ __typename, ...rest }) => rest
    );

    if (mode === "prompt") {
      promptsWithoutTypename = [promptsWithoutTypename[0]];
    }

    try {
      const { data } = await editCard({
        variables: {
          cardId: card.id,
          newTitle,
          newPrompts: promptsWithoutTypename,
        },
      });

      if (!data || !data.editCard) {
        return;
      }

      if (card.id === mains.currCard?.id) {
        setMains({
          ...mains,
          currCard: {
            id: data.editCard.id,
            aiId: data.editCard.aiId,
            topicId: data.editCard.topicId,
          },
        });
      }
      setEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deletePrompt = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const prompts = [...newPrompts];
    prompts.splice(index, 1);
    setNewPrompts(prompts);
    setIndex(index - 1);
  };

  const addNewPrompt = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const prompts = newPrompts.slice();
    prompts.splice(index + 1, 0, { title: "", content: "" });
    setNewPrompts(prompts);
    setIndex(index + 1);
  };

  return (
    <div className={style[`delete-background`]}>
      <div className={style.popup} onSubmit={confirmEdit}>
        <EditPromptHeader
          mode={mode}
          onToggleMode={setModeHandler}
          onClose={close}
        />

        <form action="" className={style.form}>
          <StackTitle
            mode={mode}
            title={newTitle}
            onTyping={(e) => setNewTitle(e.target.value)}
          />

          {mode === "stack" && (
            <StackOptions
              isSingle={newPrompts.length !== 1}
              onNext={goForward}
              onPrevious={goBack}
              onDelete={deletePrompt}
              onAddToStack={addNewPrompt}
              current={index + 1}
              stackLenght={newPrompts.length}
            />
          )}

          {mode === "stack" && (
            <PromptTitle
              title={newPrompts[index]?.title}
              onTyping={editPromptTitle}
            />
          )}

          <PromptContent
            content={newPrompts[index]?.content}
            onTyping={editPromptContent}
          />
          <EditPromptFooter
            isMutating={loading}
            onSaveChanges={editCardHandler}
          />
        </form>
      </div>
    </div>
  );
};

export default EditPrompt;
