import uniqueId from 'lodash/uniqueId'

class BusHub {
    //{eType: {name: fn, name2: fn}}
    eventHubs = {}; 
    dataHubs = {};
    
    set(key, value) {
        this.dataHubs[key] = value
        this.emit(key, value)
    }
    get(key) {
        return this.dataHubs[key]
    } 
    del(key) {
        delete this.dataHubs[key]
    }
    on(etype, func) {
        if (!this.eventHubs[etype]) {
            this.eventHubs[etype] = {}
        } 
        const key = uniqueId() 
        this.eventHubs[etype][key] = func  
        return key
    }
    emit(etype, ...params) {   
        const events = this.eventHubs[etype]   
        
        if (events) { 
            for (let key of Object.keys(events)) {   
                events[key] && events[key](...params)
            } 
        } 
    } 
    remove(...keys) { 
        const mainKeys = Object.keys(this.eventHubs)
        for (let key of keys) {
           for (let i of mainKeys) {
               if (key in this.eventHubs[i]) {
                    delete this.eventHubs[i][key]
               }
           } 
        }
    }
    getHubs() {
        return this.eventHubs
    }
}
const Bus = new BusHub()

export default Bus

export const BUS_KEYS = {
    //設計器數據
    designDataList: 1,
    //active column uuid
    activeUUID: 2,
    //鍵盤按下
    keypress: 3,
    //聚焦
    focus: 4,
    //單間左邊放入結束
    putEnd: 5,
    //替换当前
    replace: 51,
    //添加模塊成功
    addOrUpdateModelOk: 6,
    //设计器页面的预览显示状态
    updatePriviewState: 61,
    //页面数据属性 pageStyle, pageLess, pageClass
    pageData: 7,
    //我使用的组件数据
    componentList: 8,
    //right ? 使用code
    useCode: 9,
    //routes, 路径: page
    routeMap: 10,
    //页面路由，页面ID：路径Path
    routeIdPath: 11,
    //页面菜单，用于系统 $sys.menuPaths 使用,
    pageMenuOptions: 12 
}