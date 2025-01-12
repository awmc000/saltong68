import { useState } from "react"
import './HelpBox.css'
const HelpBox = (props) => {
    let [open, setOpen] = useState(false)

    const handleClick = () => {
        setOpen(
            prev => !prev
        )
    }

    return (
        <div className="outerHelpBox">
            <button onClick={handleClick}>{open ? props.closeMessage : props.openMessage }</button>
            {open && <div className="innerHelpBox">{props.children}</div>}
        </div>
    )
}

export default HelpBox