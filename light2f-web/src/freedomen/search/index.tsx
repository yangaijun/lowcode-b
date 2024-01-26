import React, { useMemo } from 'react';
import Form from '../form'
import { IFormProps } from '../config/type'
import { isRenderComponent } from '../config/props';
import './index.css'

function Search(props: IFormProps) {
    const className = useMemo(() => {
        let searchClassName = '__freedomen-search'
        if (props.className) {
            searchClassName += (" " + props.className)
        }
        return searchClassName
    }, [props.className])

    return <Form config={{ layout: 'inline', labelCol: undefined }} {...props} className={className} /> 
}

Search[isRenderComponent] = true

export default Search