import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { canPutBgColor } from 'views/light/config'

export default function useCanPutIn(group = []) { 
    const { componentDrag } = useSelector(state => state.event)
    const [canPutbackgroundColor, setCanPutBackgroundColor] = useState('white')  
    
    useEffect(() => {
        if (group.includes(componentDrag?.group)) {
            setCanPutBackgroundColor(canPutBgColor)
        } else {
            setCanPutBackgroundColor('white')
        }
    }, [componentDrag, group]) 
    
    return canPutbackgroundColor
}