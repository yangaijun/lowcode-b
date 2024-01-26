import React, { useMemo } from "react";
import { Image } from "antd";
import { IImageProps } from "../../config/type";
import { useClassName, useStyle, useFilter, useConfig } from "../../hooks/useBase";

function FImage(props: IImageProps) {
    const style = useStyle(props)
    const className = useClassName(props)
    const filter = useFilter(props)
    const config = useConfig(props)

    return useMemo(() => {
        return <Image
            src={filter}
            style={style}
            className={className}
            {...config}
        />
    }, [filter, style, className, config])

}

export default FImage