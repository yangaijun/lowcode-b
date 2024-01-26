import { IString } from "../string"
import { toFirstUpperCase } from "../util"
function hasKey(obj) {
    return Object.values(obj).length
}

class IreactBatch {
    reactBatchs = {
        refs: {},
        states: {},
        events: {}
    }
    /**
     * 
     * @param {key} name 
     * @param {{value: string, functions: {key: {tips: '提交。。', full: 'onSubmit(...)'}}}} value 
     */
    setRef(name, value = {
        value: null,
        functions: {}
    }) {
        this.reactBatchs.refs[name] = value
    }
    getRefs() {
        return this.reactBatchs.refs
    }
    hasRef() {
        return hasKey(this.reactBatchs.refs)
    }
    getStates() {
        return this.reactBatchs.states
    } 
    setState(name, value) {
        this.reactBatchs.states[name] = value
    }
    hasState() {
        return hasKey(this.reactBatchs.states)
    }
    getEvents() {
        return this.reactBatchs.events
    }
    setEvent(name, value) {
        this.reactBatchs.events[name] = value
    }
    hasEvent() {
        return hasKey(this.reactBatchs.events)
    } 

    toRefString() {
        const iString = IString()
        const { refs } = this.reactBatchs
        for (let key in refs) {
            iString.appendln(`const ${key} = useRef(${refs[key].value || ""})`)
        } 
        return iString.toString()
    }
    toStateString() {
        const iString = IString()
        const { states } = this.reactBatchs

        for (let key in states) {
            iString.appendln(`const [${key}, set${toFirstUpperCase(key)}] = useState(${states[key]})`)
        }
        return iString.toString()
    }
    toEventString() {
        const iString = IString()
        const { events } = this.reactBatchs

        for (let key in events) {
            iString.appendln(`const ${key} = ${events[key]}`)
        }
        return iString.toString()
    }
}

export default IreactBatch