import { useEffect, useRef } from "react";

export default function useUpdateEffect(fn: Function, deps: any[]) {
    const didMountRef = useRef(false)

    useEffect(() => {
        if (didMountRef.current)
            fn()
        else
            didMountRef.current = true
    }, deps)
}