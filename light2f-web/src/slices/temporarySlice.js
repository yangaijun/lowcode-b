import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
    activePanel: null,
    pageVisible: false,
    hasPermission: null,

    designInfo: {
        pageId: null,
        designType: null
    },

    userInfo: {}
}

export const temporarySlice = createSlice({
    name: 'temporary',
    initialState,
    reducers: {
        setActivePanel(state, { payload }) {
            state.activePanel = payload
        },
        setDesignInfo(state, { payload }) {
            for (let key in payload) {
                state.designInfo[key] = payload[key]
            }
        },
        setPermission(state, { payload }) {
            state.hasPermission = payload
        },
        resetPermission(state) {
            state.hasPermission = null
        },
        setUserInfo(state, { payload }) {
            state.userInfo = payload
        },
        setPageVisble(state, { payload }) {
            state.pageVisible = payload
        },
        resetTemporary(state) {
            for (let key in state) {
                if (key in initialState) {
                    state[key] = initialState[key]
                } else {
                    delete state[key]
                }
            }
        }
    }
})

export const openPage = createAsyncThunk(
    'page/openPage',
    async (showTip, { dispatch }) => {
        if (showTip) {
            message.warning({
                title: '提示',
                content: '请先选中要编辑的页面，再进行操作！'
            })
        }

        dispatch(setPageVisble(true))
    }
)

export const {
    setUserInfo,
    setActivePanel,
    setDesignInfo,
    setPermission,
    resetPermission,
    setPageVisble,
    resetTemporary
} = temporarySlice.actions;

export default temporarySlice.reducer;