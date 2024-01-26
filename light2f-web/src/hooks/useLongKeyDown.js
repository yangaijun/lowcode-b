import { useEffect, useState } from 'react' 

export default function useLongKeyDown() {
    const [longKeyDownInfo, setLongKeyDownInfo] = useState({})

    useEffect(() => { 
        const onKeydown = (evt) => {   
            if (!evt.repeat) {
                setLongKeyDownInfo({
                    code: evt.code,
                    key: evt.ctrlKey,
                    keyCode: evt.keyCode,
                    shiftKey: evt.shiftKey,
                    altKey: evt.altKey,
                    ctrlKey: evt.ctrlKey
                })
            } 
        } 
        const onKeyup = () => {
            setLongKeyDownInfo({})
        } 
        
        window.addEventListener('keydown', onKeydown)
        window.addEventListener('keyup', onKeyup) 

        return () => {
            window.removeEventListener('keydown', onKeydown)
            window.removeEventListener('keyup', onKeyup) 
        }
    }, [])

    return longKeyDownInfo
}