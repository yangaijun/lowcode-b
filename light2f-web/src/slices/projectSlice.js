import { createSlice } from '@reduxjs/toolkit'; 

export const projectSlice = createSlice({
    name: 'project',
    initialState: { 
        masterplateProject: {}
    },
    reducers: {
        setProject(state, { payload }) {
            for (let key in payload) { 
                state[key] = payload[key] 
            }  
        },  
        resetProject(state) {  
            for (let key in state) { 
                delete state[key] 
            } 
            state.masterplateProject = {}
        } 
    }
})
  
export const {
    setProject, 
    resetProject
} = projectSlice.actions;

export default projectSlice.reducer;