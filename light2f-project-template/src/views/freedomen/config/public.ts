
function sets(Defaults: any, DefaultWildcards: any, obj: any) {
    for (let key in obj) { 
        if (key.includes(',')) {
            const keys = key.split(','), robj: any = {}
            for (let k of keys) {
                robj[k] = obj[key]
            }
            sets(Defaults, DefaultWildcards, robj)
        } else if (key.includes('*')) {
            const newKey = key.split('*')[0]
            DefaultWildcards[newKey] = obj[key];
        } else {
            Defaults[key] = obj[key];
        }
    }
}

export function getDefaults(stack: any[]) {
    const obj = {},
        Defaults: any = {},
        DefaultWildcards: any = {};

    for (let item of stack) {
        if (typeof item === 'function') {
            Object.assign(obj, item())
        } else {
            Object.assign(obj, item)
        }
    }
    sets(Defaults, DefaultWildcards, obj)
    return [Defaults, DefaultWildcards]
}

export function setDefaults(stack: any[], obj: any | (() => any)) {
    obj && stack.push(obj)
}

export function clearDefaults(stack: any[], obj: any | (() => any)) {
    if (obj) {
        let index = stack.findIndex((item: any) => item === obj)
        if (index !== -1) {
            stack.splice(index, 1)
        }
    }
}