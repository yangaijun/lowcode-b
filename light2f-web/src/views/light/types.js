export const UsedType = {
    //布局
    LAYOUT: 1,
    //容器
    CONTAINER: 2,
    //EL 容器
    EL_CONTAINER: 3,
    //普通元素
    NORMAL: 4 
}
export const InitCodeType = {
    VAR: 'var',  //變量
    FN: 'fn', //函數
    EFFECT: 'effect',
    REF: 'ref'
}
//没有聚焦时候，假设当前页面就是活跃的
export const PAGE_ACTIVE_COLUMN_UUID = -1
//设计器类型
export const DesignType = {
    //母版
    MASTERPLATE: 1
}
//net plug 添加时的组件类型
export const ComponentType = {
    element: 1,
    container: 2
}
//net plug 添加时的prop的类型
export const PropType = {
    string: 1,
    number: 2,
    fn: 3,
    boolean: 4,
    json: 5
}

export const TypeType = {
    private: 'private',
    public: 'public',
    system: 'sys'
}