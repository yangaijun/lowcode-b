import Freedomen from 'freedomen';
import * as ExFreedomen from 'ex-freedomen'; 

const getCustomComponent = (Component, eventNames = []) => {
    return ({ value, $base: { placeholder, style, className, onChange, disabeld, onEvent, config } }) => {
        const events = {}
        eventNames.forEach(name => {
            events[name] = (value) => onEvent(name, value)
        })

        return <Component
            value={value}
            placeholder={placeholder}
            style={style}
            className={className}
            onChange={onChange}
            disabeld={disabeld}
            config={config}
            {...events}
        />
    }
} 
