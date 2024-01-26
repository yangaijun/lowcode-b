import { createSlice } from '@reduxjs/toolkit'; 

export const loadingSlice = createSlice({
    name: 'loading',
    initialState: {
        light: false
    },
    reducers: {
        setLight(state, { payload }) {
            state.light = payload
        } 
    }
})

export const {
    setLight
} = loadingSlice.actions;

export default loadingSlice.reducer;