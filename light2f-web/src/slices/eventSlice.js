import { createSlice } from '@reduxjs/toolkit'; 

const rightFormChange = {
    uuid: null
}
const designListChange = {
    uuid: null
}
export const eventSlice = createSlice({
    name: 'event',
    initialState: {
        //组件被拖拽
        componentDrag: null,
        //设计器组件被聚焦, you事件，不好用，结构太复杂
        designColumnFocus: {},
        //右边数据变化
        rightFormChange,
        //設計器或者右边数据变化
        designListChange 
    },
    reducers: {
        setComponentDrag(state, { payload }) {
            state.componentDrag = payload
        }, 
        setDesignColumnFocus(state, { payload }) {
            state.designColumnFocus = payload
        },
        setRightFormChange(state, { payload }) {
            state.rightFormChange = payload
        },
        setDesignListChange(state, { payload }) {
            state.designListChange = payload
        },
        resetRightAndDesignChange(state) {
            state.rightFormChange = rightFormChange
            state.designListChange = designListChange
        }
    }
})
  
export const {
    setComponentDrag,
    setDesignColumnFocus,
    setRightFormChange,
    setDesignListChange,
    resetRightAndDesignChange
} = eventSlice.actions;

export default eventSlice.reducer;