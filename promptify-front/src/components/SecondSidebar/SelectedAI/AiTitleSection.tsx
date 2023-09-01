import { Dispatch, useState } from "react";
import { useMutation } from "@apollo/client";

import { ADD_AI_FAV, EDIT_AI, DELETE_AI, ME, GET_AIS } from "@/queries";
import { AI, User, Mains } from "@/types";

import DeleteAlert from "@/components/DeleteAlert";
import EditableAiTitle from "./AiEditableTitle";
import AiTitleOptions from "./AiTitleOptions";

import style from "@/styles/secondSidebar.module.css";

interface AiTitleSectionProps {
  me: User | undefined;
  aiList: AI[] | undefined;
  mains: Mains;
  setMains: Dispatch<Mains>;
}

export default function AiTitleSection({
  me,
  aiList,
  mains,
  setMains,
}: AiTitleSectionProps) {
  const currentAI = aiList?.find((ai: AI) => ai.id === mains.main?.id);

  const [edit, setEdit] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string | undefined>(currentAI?.name);
  const [del, setDel] = useState(false);

  const [addAiToFavs, { loading: AATFloading }] = useMutation(ADD_AI_FAV);
  const [editAi, { loading: EAloading }] = useMutation(EDIT_AI);
  const [deleteAi, { loading: DAloading }] = useMutation(DELETE_AI, {
    update: (cache, response) => {
      cache.updateQuery({ query: ME }, ({ me }) => {
        const newList = me.allPrompts.filter(
          (id: string) => id !== response.data.deleteAi
        );
        const newME = { ...me };
        newME.allPrompts = newList;
        return {
          me: newME,
        };
      });
      cache.updateQuery(
        { query: GET_AIS, variables: { meId: me?.id } },
        ({ getAis }) => {
          return {
            getAis: getAis.filter((ai: AI) => ai.id !== response.data.deleteAi),
          };
        }
      );
    },
  });

  const handleAddToFavs = async () => {
    try {
      if (!currentAI) {
        return;
      }

      await addAiToFavs({ variables: { aiId: currentAI?.id } });
    } catch (error) {
      console.error("An error occurred while adding to favorites:", error);
    }
  };

  const handleEnableEdit = () => {
    setEdit(!edit);
  };

  const handleConfirmEdit = async () => {
    try {
      if (!currentAI || !newTitle) {
        return;
      }

      if (currentAI?.name === newTitle) {
        setEdit(!edit);
        return;
      }

      await editAi({ variables: { aiId: currentAI?.id, newName: newTitle } });

      setEdit(!edit);
    } catch (error) {
      console.error("An error occurred while editing AI:", error);
    }
  };

  const deleteAifunc = async (userId: string, aiId: string) => {
    if (!userId || !aiId || !aiList) return;

    try {
      await deleteAi({ variables: { userId, aiId } });

      const newAiList = aiList?.filter((arrayAi: AI) => arrayAi.id !== aiId);

      if (newAiList.length === 0) {
        setMains({
          main: undefined,
          topic: undefined,
          currCard: undefined,
          profile: true,
        });
      } else {
        setMains({ ...mains, main: { id: newAiList[0].id } });
      }
    } catch (error) {
      console.error("Error deleting AI:", error);
    }
  };

  const handleDeleteAi = async () => {
    if (!currentAI) return;

    await deleteAifunc(currentAI?.userId, currentAI?.id);

    setDel(false);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  if (mains.profile) return null;

  return (
    <>
      <div className={style[`ai-container`]}>
        <DeleteAlert
          onAccept={handleDeleteAi}
          onCancel={setDel}
          isShown={del}
          loading={DAloading}
        />
        <EditableAiTitle
          title={currentAI?.name}
          newTitle={newTitle}
          isEditEnabled={edit}
          onTyping={handleTyping}
        />
        <AiTitleOptions
          isEditEnabled={edit}
          isFav={currentAI?.fav}
          isMutating={EAloading || AATFloading}
          onToggleFav={handleAddToFavs}
          onConfirmEdit={handleConfirmEdit}
          onCancelEdit={handleEnableEdit}
        />
      </div>
      <div className={style["ai-options2"]}>
        <button
          className={`${style[`del`]} p`}
          title="delete"
          onClick={() => setDel(true)}
        />

        <button
          className={`${style[`edit`]} p`}
          title="edit"
          onClick={handleEnableEdit}
        ></button>
      </div>
    </>
  );
}
