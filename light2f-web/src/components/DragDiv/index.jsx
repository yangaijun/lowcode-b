import { useCallback, useEffect, useRef, useState } from "react"
import className from 'classnames'

export default function DragDiv(props) {
    const [style, setStyle] = useState()
    const dataRef = useRef({})
    const divRef = useRef(null)

    const onMouseDown = useCallback((e) => {
        dataRef.current.canDrag = true

        dataRef.current.top = e.clientY - divRef.current.offsetTop
        dataRef.current.left = e.clientX - divRef.current.offsetLeft

        dataRef.current.height = divRef.current.clientHeight
        dataRef.current.width = divRef.current.clientWidth


        e.preventDefault();
    }, [])

    useEffect(() => {
        const onMouseUp = () => {
            dataRef.current.canDrag = false
        }
        const onMouseMove = (e) => {
            if (!dataRef.current.canDrag) return

            let top = e.clientY - dataRef.current.top;
            let left = e.clientX - dataRef.current.left;

            if (top <= 0) top = 0
            if (left <= 0) left = 0

            if (top + dataRef.current.height >= document.body.clientHeight) top = document.body.clientHeight - dataRef.current.height
            if (left + dataRef.current.width >= document.body.clientWidth) left = document.body.clientWidth - dataRef.current.width

            props.onMove?.()
            setStyle({ top: `${top}px`, left: `${left}px` });
        }

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [props.onMove])

    return <div
        ref={divRef}
        style={style}
        onMouseDown={onMouseDown}
        className={className(props.className)}
    >
        {props.children}
    </div>
}