import React, { useMemo } from "react";
import { IImgProps } from "../../config/type";
import { useClassName, useStyle, useFilter, useConfig } from "../../hooks/useBase";
 
function FImg(props: IImgProps) { 
    const style = useStyle(props)
    const className = useClassName(props)
    const filter = useFilter(props)
    const config = useConfig(props)

    return useMemo(() => {
        return <img
            alt=""
            src={filter}
            style={style}
            className={className}
            {...config}
        />
    }, [filter, style, className, config])

}

export default FImg