import React, { ReactElement, ReactNode } from "react";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

type DialogProps = {
    isOpen: boolean
    children: ReactNode
    onClose?: () => void
    canClose?: boolean
    className?: string
}

export default function Dialog({ isOpen, className, children, onClose, canClose = true }: DialogProps): ReactElement {

    const handleClose = () => {
        if (!canClose) return
        onClose?.()
    }

    return (
        <CSSTransition
            in={isOpen}
            classNames="app-transition-modal"
            mountOnEnter={true}
            unmountOnExit={true}
            timeout={500}
            addEndListener={(node, done) => {
                node.addEventListener('transitionend', done, false);
            }}
        >
            <div className="or-overlay--backdrop fixed inset-0" onClick={handleClose}>
                <div className={`or-dialog--padded relative mx-auto mt-8 mb-2 ${className}`} onClick={(e) => e.stopPropagation()}>
                    {canClose && (
                        <button onClick={handleClose} className="or-button--ghost absolute top-0 right-0">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    )}
                    { children }
                </div>
            </div>
        </CSSTransition>
    )
}
