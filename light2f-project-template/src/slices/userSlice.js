import { createSlice } from '@reduxjs/toolkit';
import user from 'libs/user';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        pageLoading: false,
        userMenuPaths: user.getUserMenuPaths(),
    },
    reducers: {
        setPageLoading(state, { payload }) {
            state.pageLoading = payload
        },
        setUserMenuPaths(state, { payload }) {
            user.setUserMenuPaths(payload)
            state.userMenuPaths = payload
        },
        clearUserMenuPaths(state) {
            user.removeUserMenuPaths()
            state.userMenuPaths = null
        }
    }
})

export const {
    setUserMenuPaths,
    clearUserMenuPaths,
    setPageLoading
} = userSlice.actions;

export default userSlice.reducer;