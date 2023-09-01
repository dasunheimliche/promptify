import { useState } from "react";

import { Card, Mains, Visibility, Prompt } from "@/types";
import { closePopUp } from "@/utils/functions";

import { useMutation } from "@apollo/client";
import { ADD_CARD, GET_CARDS } from "@/queries";

import style from "@/styles/popups.module.css";

import StackTitle from "../EditPrompt/StackTitle";
import StackOptions from "../EditPrompt/StackOptions";
import PromptTitle from "../EditPrompt/PromptTitle";
import PromptContent from "../EditPrompt/PromptContent";

interface AddPromptProps {
  setVisibility: React.Dispatch<React.SetStateAction<Visibility>>;
  mains: Mains;
}

interface addCardData {
  createCard: Card;
}

interface promptVariables {
  title: string;
  content: string;
}

interface addCardVariables {
  topicId: string;
  card: {
    title: string;
    prompts: promptVariables[];
  };
}

export default function AddStack({ mains, setVisibility }: AddPromptProps) {
  const [newTitle, setNewTitle] = useState<string>("");
  const [newPrompts, setNewPrompts] = useState<Prompt[]>([]);
  const [index, setIndex] = useState<number>(0);

  const [createCard, { loading }] = useMutation<addCardData, addCardVariables>(
    ADD_CARD,
    {
      update: (cache, response) => {
        cache.updateQuery(
          { query: GET_CARDS, variables: { topicId: mains.topic?.id } },
          ({ getCards }) => {
            // * main.mains
            return {
              getCards: getCards.concat(response.data?.createCard),
            };
          }
        );
      },
    }
  );

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

  const addPrompt = async (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!mains.topic || newPrompts.length < 1) {
      return;
    }

    const variables = {
      topicId: mains.topic.id,
      aiId: mains.topic.aiId,
      card: {
        title: newTitle,
        prompts: newPrompts,
      },
    };

    try {
      const newCard = await createCard({ variables });

      if (!newCard.data) return;

      setVisibility((prev) => ({ ...prev, showMenu: "none" }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={style.popup} onSubmit={addPrompt}>
      <div className={style.header}>
        <div className={style[`header-title`]}>Add a Stack</div>
        <button
          className={style[`header-close`]}
          onClick={(e) => closePopUp(e, setVisibility)}
        >
          ✕
        </button>
      </div>
      <form action="" className={style.form}>
        <StackTitle
          mode={"stack"}
          title={newTitle}
          onTyping={(e) => setNewTitle(e.target.value)}
        />
        <StackOptions
          isSingle={newPrompts.length !== 1}
          onNext={goForward}
          onPrevious={goBack}
          onDelete={deletePrompt}
          onAddToStack={addNewPrompt}
          current={index + 1}
          stackLenght={newPrompts.length}
        />
        <PromptTitle
          title={newPrompts[index]?.title}
          onTyping={editPromptTitle}
        />
        <PromptContent
          content={newPrompts[index]?.content}
          onTyping={editPromptContent}
        />
        <div className={style.buttons}>
          <button type="submit" disabled={loading}>
            Add Prompt
          </button>
        </div>
      </form>
    </div>
  );
}
