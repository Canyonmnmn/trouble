import clsx from 'clsx'
import React from 'react'

interface optionComponentProps {
    showSide: number,
    _setShowSide:(which:number)=>void,
    title:string,
    optionComponentType:number,
    icon:string
}

export default function OptionComponent(props: optionComponentProps) {

    const {
        showSide,
        _setShowSide,
        title,
        optionComponentType,
        icon
    } = props

    return (
        <li
            className={clsx(
                "flex flex-col items-center mt-5 cursor-pointer",
                showSide === optionComponentType
                    ? "box-border border-y-0 border-r-0 border-l-4 border-indigo-500 border-solid text-[#0057ff]" : ""
            )}
            onClick={() => _setShowSide(optionComponentType)}>
            <i
                className={clsx("iconfont", icon)}
            />
            <span className={clsx("text-[14px]")}>{ title }</span>
        </li>
    )
}