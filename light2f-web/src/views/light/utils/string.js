class S {
    constructor(s = '') {
        this.s = s
    }
    //"s = <v1> word!"; values = ({v1: 'holle'}) => 'holle word!'
    template(values, oc, cc) {
        let opening = oc || "<!"
        let closing = cc || "!>"

        let open = opening.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
        let close = closing.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
        let r = new RegExp(open + '(.+?)' + close, 'g')
        //, r = /\{\{(.+?)\}\}/g
        let matches = this.s.match(r) || [];

        matches.forEach((match) => {
            const key = match.substring(opening.length, match.length - closing.length).trim();//chop {{ and }}
            const value = typeof values[key] == 'undefined' ? '' : values[key];
            this.s = this.s.replace(match, value);
        });

        return this
    }
    //s = " "; n = 4 => "    "
    repeat(n) {
        this.s = new Array(n + 1).join(this.s)

        return this
    }
    insertln(next = "", position = 0, isAppend = true) {
        if (isAppend) {
            this.s = this.s.substring(0, position)
                + next + '\n'
                + this.s.substring(position)
        }
        return this
    }
    insert(next = "", position = 0, isAppend = true) {
        if (isAppend) {
            this.s = this.s.substring(0, position)
                + next
                + this.s.substring(position)
        }
        return this
    }
    //when .appendln("", a == 6)
    appendln(next = "", isAppend = true) {
        if (isAppend) {
            this.s = this.s + next + '\n'
        }
        return this
    }
    append(next = "", isAppend = true) {
        if (isAppend) {
            this.s = this.s + next
        }
        return this
    }
    removeLeft(n) {
        if (n < this.s.length) {
            this.s = this.s.substring(n)
        }
        return this
    }
    removeRight(n) {
        if (n < this.s.length) {
            this.s = this.s.substring(0, this.s.length - n)
        }
        return this
    }
    toString(clearOverLn = false) {
        if (clearOverLn) {
            if (this.s[this.s.length - 1] === '\n') {
                return this.s.substring(0, this.s.length - 1)
            }
        }

        return this.s
    }
    //是否是对象 2:true, Object.assign({}, {a: 12}): true, {ba:12}): false, "s'tring": true, "str: false
    isParam() {
        //string
        if (["'", '"'].includes(this.s[0])) {
            try {
                (new Function("return " + this.s))();
                return true
            } catch (error) {
                return false
            }
        }
        let errors = 0
        for (let i = 0; i < this.s.length; i++) {
            if (['[', '{', '('].includes(this.s[i])) errors ++
            else if ([']', '}', ')'].includes(this.s[i])) errors --
        }
        return !!errors
    }
}

export function IString(s = '') {
    return new S(s)
}
