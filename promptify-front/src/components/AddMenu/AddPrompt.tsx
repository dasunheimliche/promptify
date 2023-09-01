import { useState } from "react";

import { Visibility, Card, Mains } from "@/types";
import { closePopUp } from "@/utils/functions";

import { useMutation } from "@apollo/client";
import { ADD_CARD, GET_CARDS } from "@/queries";

import style from "@/styles/popups.module.css";

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
  aiId: string;
  card: {
    title: string;
    prompts: promptVariables[];
  };
}

export default function AddPrompt({ mains, setVisibility }: AddPromptProps) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const [createCard, { loading }] = useMutation<addCardData, addCardVariables>(
    ADD_CARD,
    {
      update: (cache, response) => {
        cache.updateQuery(
          { query: GET_CARDS, variables: { topicId: mains.topic?.id } },
          ({ getCards }) => {
            return {
              getCards: getCards.concat(response.data?.createCard),
            };
          }
        );
      },
    }
  );

  const addPrompt = async (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!mains.topic) {
      return;
    }

    const { id, aiId } = mains.topic;

    const variables = {
      topicId: id,
      aiId,
      card: {
        title,
        prompts: [
          {
            title: "",
            content,
          },
        ],
      },
    };

    try {
      const { data: newCard } = await createCard({ variables });

      if (!newCard) return;

      setVisibility((prev) => ({ ...prev, showMenu: "none" }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={style.popup} onSubmit={addPrompt}>
      <div className={style.header}>
        <div className={style[`header-title`]}>Add a Prompt</div>
        <button
          className={style[`header-close`]}
          onClick={(e) => closePopUp(e, setVisibility)}
        >
          ✕
        </button>
      </div>

      <form action="" className={style.form}>
        <label className={style.title}>{"Title"}</label>
        <input
          type="text"
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
          minLength={1}
          required
        />

        <label className={style.title}>{"Prompt"}</label>
        <textarea
          value={content}
          placeholder="Write your prompt"
          onChange={(e) => setContent(e.target.value)}
          required
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
