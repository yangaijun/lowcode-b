import React from "react";
import { IListProps } from "../config/type";
import { useListComponent } from "../hooks/useBase";
import { isRenderComponent } from "../config/props";
import Region from "../region";

function FList(props: IListProps) {
    const { columns, onEvent, data, style, className, onChange } = props

    const { innerData, innerChange, innerEvent } = useListComponent(onChange, onEvent, data)
    return (
        <div style={style} className={className}>
            {innerData?.map((data) => {
                return (
                    <Region key={data.key} data={data} onChange={innerChange} columns={columns} onEvent={innerEvent} />
                )
            })}
        </div>
    )
}

FList[isRenderComponent] = true

export default FList