import React, { ReactElement, ReactNode } from "react";

type InputProps = {
    value: string
    onChange?: (value: string) => void
    className?: string
    placeholder?: string
    type?: string
    leftElement?: ReactNode
    rightElement?: ReactNode
    allows?: RegExp | string
    format?: RegExp | string
}

export default function Input(props: InputProps): ReactElement {

    const sanitizeAndChange = (value: string) => {
        let output = value
        if (props.allows) {
            const regex = new RegExp(props.allows)
            const invert = new RegExp(`[^${regex.source}]`, `${regex.flags}g`)
            output = output.replace(invert, '')
        }
        if (props.format) {
            const regex = new RegExp(props.format)
            const matches = regex.exec(output)
            output = matches ? matches[0] : ''
        }
        props.onChange?.(output)
    }

    const handleChange = ({ target: { value }}: any) => {
        sanitizeAndChange(value)
    }

    const handlePaste = (event: any) => {
        sanitizeAndChange(event.clipboardData.getData('text/plain'))
    }

    return (
        <div className="or-input">
            {props.leftElement && (
                <div className="or-input__info">
                    {props.leftElement}
                </div>
            )}
            <input
                className={`or-input__input ${props.className}`}
                value={props.value}
                onChange={handleChange}
                onPaste={handlePaste}
                type={props.type ?? 'text'}
                placeholder={props.placeholder}
            />
            {props.rightElement && (
                <div className="or-input__info">
                    {props.rightElement}
                </div>
            )}
        </div>
    )
}
