import { useChildren } from "../../hooks/useBase";
import React, { useMemo } from "react";

export interface fragmentProps {
    children: React.ReactElement
}
export default function FFragment(props: fragmentProps) { 
    const children = useChildren(props)
    
    return useMemo(() => {
        return <React.Fragment
        >
            {children}
        </React.Fragment>
    }, [children])

}