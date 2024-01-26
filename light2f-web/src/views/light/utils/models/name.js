class Name {
    names = {}
    get = (name) => { 
        if (this.names[name] === void 0) {
            this.names[name] = {
                index: 0,
                name: name
            }
            return name
        } else {
            this.names[name].index ++
            let newName = this.names[name].name + this.names[name].index
            return newName
        }
    } 
} 
export default Name