import { h } from "preact";
import "./CloseIcon.scss";

const CloseIcon = () => {
    return (
        <svg className="CloseIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z" fill="#FFF" />
        </svg>
    );
};

export default CloseIcon;