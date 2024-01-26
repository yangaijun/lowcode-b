class Iinfo {
    info = {
        dialogOrDrawerNames: [],
        fdialogOrFdrawerNameAndFName: {}
    }

    putDialogOrDrawerName(name) {
        this.info.dialogOrDrawerNames.push(name)
    }

    hasDialogOrDrawerName(name) {
        return this.info.dialogOrDrawerNames.includes(name)
    }

    getDialogOrDrawerNames() {
        return this.info.dialogOrDrawerNames
    }

    putNAndFn(name, formName) {
        this.info.fdialogOrFdrawerNameAndFName[name] = formName
    }
    
    getFnByN(name) {
        return this.info.fdialogOrFdrawerNameAndFName[name]
    }
}

export default Iinfo