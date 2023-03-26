import { Topic } from '../types'



interface MainContentMenu {
    topic: Topic | undefined
}


const MainContentMenu = ({topic} : MainContentMenu )=> {

    return (
        <div className="mc-header">
            <div className="mc-header-title">{topic?.name}</div>
        </div>
    )
}

export default MainContentMenu