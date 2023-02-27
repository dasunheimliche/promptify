
interface MainContentMenu {
    topic: string
}


const MainContentMenu = ({topic} : MainContentMenu )=> {

    return (
        <div className="mc-header">
            <div className="mc-header-title">{topic}</div>
        </div>
    )
}

export default MainContentMenu