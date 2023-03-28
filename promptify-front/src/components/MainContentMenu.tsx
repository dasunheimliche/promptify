import { Topic } from '../types'
import style from '../styles/mainContent.module.css'


interface MainContentMenu {
    topic: Topic | undefined
}


const MainContentMenu = ({topic} : MainContentMenu )=> {

    return (
        <div className={style.header}>
            <div className={style[`header-title`]}>{topic?.name}</div>
        </div>
    )
}

export default MainContentMenu