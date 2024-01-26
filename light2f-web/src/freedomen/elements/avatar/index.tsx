import React, { useMemo } from "react";
import { Avatar } from "antd";
import { useStyle, useClassName, useFilter, useConfig } from "../../hooks/useBase";
import { IAvatarProps } from "../../config/type";
 
function FAvatar(props: IAvatarProps) {

    const style = useStyle(props)
    const className = useClassName(props)
    const filter = useFilter(props)

    const config = useConfig(props)

    return useMemo(() => { 
        return  <Avatar  
            src={filter} 
            className={className}
            style={style}
            {...config}
        />;
    }, [filter, className, style, config]) 
}

export default FAvatar
