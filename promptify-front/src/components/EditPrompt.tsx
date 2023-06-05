import { Dispatch, useState } from 'react'

import { Card, Prompt } from '@/types'

import { useMutation } from '@apollo/client'
import { EDIT_CARD } from '@/queries'
import { Mains } from '@/types'

import style from '../styles/popups.module.css'

interface EditPRomptProps {
    card: Card
    mains: Mains
    cardList: Card[]
    edit: boolean
    setMains: Dispatch<Mains>
    setCardList: Dispatch<Card[]>
    setEdit: Dispatch<boolean>
}

type mode = "stack" | "prompt"

const EditPrompt = ({card, mains, cardList, setEdit, setCardList, setMains} : EditPRomptProps)=> {
    const [mode, setMode] = useState<mode>(card.prompts.length > 1? "stack" : "prompt")

    // ESTADOS
    const [newTitle, setNewTitle] = useState<string>(card.title)
    const [newPrompts, setNewPrompts] = useState<Prompt[]>(card.prompts)
    const [index, setIndex] = useState<number>(0)

    // MUTATIONS
    const [ editCard, {loading} ] = useMutation(EDIT_CARD) 

    // EVENT HANDLERS
    const confirmEdit = ()=> {
        return
    }

    const close = ()=> {
        setEdit(false)
    }

    const setModeHandler = ()=> {
        if (mode === "prompt") {
            setMode("stack")
        } else {
            setIndex(0)
            setMode("prompt")
        }
    }

    const goBack = ()=> {
        if (index-1 < 0) return
        setIndex(index - 1)
    }

    const goForward = ()=> {
        if ((index + 1) > (newPrompts.length - 1)) {
            return
        }

        setIndex(index + 1)
    }

    const editPromptTitle = (e:React.ChangeEvent<HTMLInputElement>)=> {
        const prompts = [...newPrompts]
        prompts[index] = {...prompts[index], title: e.target.value}
        setNewPrompts(prompts)
    }

    const editPromptContent = (e: React.ChangeEvent<HTMLTextAreaElement>)=> {
        const prompts = [...newPrompts]
        prompts[index] = {...prompts[index], content: e.target.value}
        setNewPrompts(prompts)
    }

    const editCardHandler = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
        e.preventDefault()

        let promptsWithoutTypename = newPrompts.map((obj) => {
            const { __typename, ...rest } = obj; // crea una copia del objeto sin la propiedad 'description'
            return rest; // devuelve el objeto sin la propiedad 'description'
        });

        if (mode === "prompt") {
            promptsWithoutTypename = [promptsWithoutTypename[0]]
        }

        const newCard = await editCard({variables: {cardId: card.id, newTitle, newPrompts:promptsWithoutTypename}})

        if (!newCard) {
            return
        }

        const cardIndex =  cardList.findIndex(c => c.id === card.id)
        const newCardList = [...cardList]
        newCardList[cardIndex] = newCard.data.editCard
  
        setCardList(newCardList)

        if (card.id === mains.currCard?.id) {
            setMains({...mains, currCard: newCard.data.editCard})
        }
        setEdit(false)
    }

    const deletePrompt = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        e.preventDefault()
        const prompts = [...newPrompts]
        const editedPrompts = prompts.splice(index,1)
        setNewPrompts(editedPrompts)
        setIndex(index-1)
    }

    const addNewPrompt = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        e.preventDefault()
        const prompts = newPrompts.slice()
        prompts.splice(index+1, 0, {title:"", content:""})
        setNewPrompts(prompts)  
        setIndex(index+1)
    }

    const doNothing = (e:any)=> {
        e.preventDefault()
    }


    return(
        <div className={style[`delete-background`]}>
            <div className={style.popup} onSubmit={confirmEdit}>

                <div className={style.header}>
                    <div className={style[`header-first`]}>
                        <div className={style[`header-title`]}>{mode === "prompt"? "Edit Prompt" : "Edit Stack"}</div>
                        <div className="p" onClick={setModeHandler}>{mode === "prompt"? "To stack" : "To prompt"}</div>
                    </div>

                    <div className={`${style[`header-close`]} p`} onClick={close}>x</div>
                </div>

                <form action="" className={style.form}>
                    <label className={style.title}>{mode === "prompt"? "Title" : "Stack title"}</label>
                    <input value={newTitle} type="text" placeholder="title" onChange={e=>setNewTitle(e.target.value)} minLength={1} required/>
                    
                    <div className={style[`prompt-container`]}>
                        {mode === "stack" &&
                            <div className={style[`stack-header`]}>

                                <label className={style.title}>
                                    {`PROMPT `}
                                    <div className={style.playback}>
                                        <div className={style.goBack} onClick={goBack}></div>
                                        <div>{`${index + 1} of ${newPrompts.length}`}</div>
                                        <div className={style.goForward} onClick={goForward}></div>
                                    </div>
                                </label>

                                <div className={style.options}>
                                    {newPrompts.length !== 1 && <div className={style.delete} onClick={deletePrompt}></div>}
                                    <div className={style.addPrompt} onClick={addNewPrompt} >Add + </div>
                                </div>
                            </div>
                        }

                        {mode === "prompt" && <label className={style.title}>{"Prompt"}</label>}
                        {mode === "stack" && <label className={style.title}>{"Prompt title:"}</label>}
                        {mode === "stack" && <input value={newPrompts[index]?.title} placeholder={"Edit prompt title"} onChange={editPromptTitle} minLength={1} required/>}
                        {mode === "stack" && <label className={style.title}>{"Prompt Content:"}</label>}
                        <textarea value={newPrompts[index]?.content}  placeholder="Write your prompt" onChange={editPromptContent} minLength={1} required/>
                    </div>

                    <div className={style.buttons}>
                        <button onClick={loading? doNothing : editCardHandler}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditPrompt