
import { EyeFilled, EyeInvisibleOutlined, CloseOutlined } from '@ant-design/icons'
import { FloatButton } from 'antd';
import { Resizable } from 're-resizable';
import { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import Bus, { BUS_KEYS } from 'views/light/bus';

const maxWidth = 980
const minWidth = 460
const defaultZoome = minWidth / maxWidth

export default function DragPreview({ children, visible }) {
    const mainRef = useRef()
    const [zoom, setZoom] = useState(defaultZoome)
    const [showContainer, setShowContainer] = useState(true)
    const [previewVisible, setPreviewVisible] = useState(true)

    useEffect(() => {
        const updatePriviewStateKey = Bus.on(BUS_KEYS.updatePriviewState, (state) => {
            setPreviewVisible(state)
        })
        return () => {
            Bus.remove(updatePriviewStateKey)
        }
    }, [])

    return <>
        <Draggable handle='.drag-header'>
            <div className='preview-container' ref={mainRef} style={{ display: previewVisible && visible && showContainer ? 'block' : 'none' }}>
                <Resizable defaultSize={{ width: minWidth, height: 280 }} minHeight={280} minWidth={minWidth} onResizeStop={() => {
                    const { clientWidth } = mainRef.current
                    const scale = clientWidth / maxWidth
                    setZoom(scale > 1 ? 1 : scale)
                }}>
                    <div className='drag-header'>
                        实时预览
                        <div className='drag-header-closed' onClick={e => {
                            setShowContainer(false)
                        }}>
                            <CloseOutlined />
                        </div>
                    </div>
                    <div className='pc-body' style={{ zoom }}>
                        {previewVisible && visible && showContainer && children}
                    </div>
                </Resizable>
            </div>
        </Draggable>
        <Draggable>
            <FloatButton
                style={{ display: visible ? 'block' : 'none' }}
                type={showContainer ? "primary" : undefined}
                className="preview-button"
                icon={showContainer ? <EyeFilled title='预览已打开' /> : <EyeInvisibleOutlined title='预览已关闭' />}
                onClick={() => {
                    setShowContainer(!showContainer)
                }}
            />
        </Draggable>
    </>
}