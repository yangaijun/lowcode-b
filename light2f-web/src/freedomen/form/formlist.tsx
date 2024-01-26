import React, { useMemo } from 'react';
import Region from '../region';
import { Form } from 'antd';
import { setColumns } from './util';
import { useListComponent } from '../hooks/useBase';
import { hasNameProp, isRenderComponent } from '../config/props';

function FFormList(props: any) {
    const { data, name, columns = [], onEvent, onChange } = props

    const { innerData, innerChange, innerEvent } = useListComponent(onChange, onEvent, data)

    const formColumns = useMemo(() => {
        return innerData.map((data: any) => (
            <Region
                data={data}
                key={data.key}
                onEvent={innerEvent}
                onChange={innerChange}
                columns={setColumns(data, columns)}
            />
        ))
    }, [innerData, innerChange, innerEvent, columns])

    return <Form.List name={name}>
        {() => formColumns}
    </Form.List>
}

FFormList[isRenderComponent] = true

FFormList[hasNameProp] = true

export default FFormList