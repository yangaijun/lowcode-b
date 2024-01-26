import { configureStore } from '@reduxjs/toolkit'
import projectReducer from 'slices/projectSlice'
import pageReducer from 'slices/pageSlice'
import loadingReducer from 'slices/loadingSlice'
import eventReducer from 'slices/eventSlice'
import temporaryReducer from 'slices/temporarySlice'

export default configureStore({
    reducer: {
        project: projectReducer,
        page: pageReducer,
        event: eventReducer,
        loading: loadingReducer,
        //临时，散装的
        temporary: temporaryReducer,
    },
})