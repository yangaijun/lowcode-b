
import { ContainerOutlined, CloseOutlined, ReadOutlined } from '@ant-design/icons'
import { FloatButton, Popconfirm } from 'antd';
import { Resizable } from 're-resizable';
import { useState } from 'react';
import Draggable from 'react-draggable';
import Doc from './doc'
import user from 'libs/user';

const minWidth = 620, minHeight = 540
const iknowKey = 'iknowdoc'

export default function DragDoc({ visible }) {
    const [showContainer, setShowContainer] = useState(false)
    const [openTip, setOpenTip] = useState(() => !user.getIknow(iknowKey))

    return <>
        <Draggable handle='.drag-header'>
            <div className='doc-container' style={{ display: visible && showContainer ? 'block' : 'none' }}>
                <Resizable defaultSize={{ width: minWidth, height: minHeight }} minWidth={minWidth} minHeight={minHeight}>
                    <div className='drag-header'>
                        使用文档
                        <div className='drag-header-closed' onClick={e => {
                            setShowContainer(false)
                        }}>
                            <CloseOutlined />
                        </div>
                    </div>
                    <div className='doc-body' >
                        <Doc />
                    </div>
                </Resizable>
            </div>
        </Draggable>
        <Popconfirm
            open={openTip}
            title="文档将都搬到这里啦，此处可以打开使用文档！"
            okText="知道了，不在提示"
            onCancel={() => { setOpenTip(false) }}
            onConfirm={() => {
                user.setIknow(iknowKey)
                setOpenTip(false)
            }}
        >
            <Draggable>
                <FloatButton
                    style={{ display: visible ? 'block' : 'none' }}
                    type={showContainer ? "primary" : undefined}
                    className="doc-button"
                    icon={showContainer ? <ReadOutlined title='文档已打开' /> : <ContainerOutlined title='文档已关闭' />}
                    onClick={() => {
                        setShowContainer(!showContainer)
                    }}
                />

            </Draggable>
        </Popconfirm>
    </>
}