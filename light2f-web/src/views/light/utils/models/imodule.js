import { IString } from "../string"

class Imodules {
    modules = {}
    
    init(moduleName) {
        if (!this.modules[moduleName]) {
            this.modules[moduleName] = { 
                //类名，React
                cNames: new Set(),
                //模块名 useState
                pNames: new Set()
            }
        }
    }
    /**
     * import React from 'react'
     * @param {'react'} moduleName 
     * @param {'React'} name 
     */
    pushC(moduleName, cName) {
        this.init(moduleName)
        this.modules[moduleName].cNames.add(cName)
        return this
    }
    /**
     * import React, {useState} from 'react'
     * @param {'react'} moduleName 
     * @param {'useState'} pName 
     * @returns 
     */
    pushP(moduleName, pName) {
        this.init(moduleName)
        this.modules[moduleName].pNames.add(pName)
        return this
    }
    toString() {
        const iString = IString()
        for (let key in this.modules) {
            iString.append("import ")
            if (this.modules[key].cNames.size) {
                this.modules[key].cNames.forEach(name => {
                    iString.append(name)
                        .append(",", this.modules[key].pNames.size)
                })
            }
            if (this.modules[key].pNames.size) {
                iString.append("{")
                this.modules[key].pNames.forEach(name => {
                    iString.append(name)
                        .append(",")
                })
                iString.append("}")
            }
            iString.append(" from ").appendln(`"${key}";`)
        }
        return iString.toString()
    }
} 

export const moduleNames = {
    antd: 'antd',
    react: 'react',
    icon: '@ant-design/icons',
    freedomen: 'freedomen',
    style: './index.module.less',
    util: 'libs/util',
    global: 'libs/consts'
}

export default Imodules