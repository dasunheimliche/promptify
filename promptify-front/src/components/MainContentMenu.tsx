import { Mains } from '../types'
import style from '../styles/mainContent.module.css'


interface MainContentMenu {
    mains: Mains
}


const MainContentMenu = ({mains} : MainContentMenu )=> {

    return (
        <div className={style.header}>
            <div className={style[`header-title`]}>{mains.topic?.name}</div>
        </div>
    )
}

export default MainContentMenu