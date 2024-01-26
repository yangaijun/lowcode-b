import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Upload, message, Button } from "antd";
import util from '../../utils/util';
import { getOriginalType } from "../../utils/base";
import { IUploadProps } from "../../config/type";
import { LoadingOutlined, PlusOutlined, UploadOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useStyle, useClassName, useDisabled, useChange, useConfig, useRidkeyConfig } from "../../hooks/useBase";

const { Dragger } = Upload;
const ridKeys = ['fileexts', 'filetypes', 'filesize', 'maxcount', 'text', 'filter', 'onSuccess', 'onError'];

const types: any = {
    upload: 'upload',
    primary: 'upload-primary',
    img: 'upload-img',
    imgs: 'upload-imgs',
    dragger: 'upload-dragger',
};

const texts = {
    upload: '点击上传',
    dragger: '点击或将文件拖拽到此区域进行上传'
}

function getBase64(img: any, callback: Function) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function isRejectUploadFile(file: any) {
    return file.name !== void 0 && file.size !== void 0 && file.status === void 0;
}
/**
 * items 是否包含 item (不区分大小写)
 * @param {string} item
 * @param {string/number} uid
 * @param {string/array[string]} items 
 * @returns 
 */
function isIncludes(item: string, items: string[]) {
    return items.toString().toUpperCase().includes(item.toUpperCase())
}

function getItemValue(value: any, uid: number, data: any, filter: Function) {
    if (typeof value === 'number' || typeof value === 'string') {
        const url = filter({ value: value, data: data })
        return { url, name: url, uid }
    } else if (util.isPlainObject(value)) {
        const url = filter({ value: value, data: data })
        return { ...value, url, name: value.name || url, uid }
    } else {
        return value
    }
}

const imgContainerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    position: "relative",
    alignItems: "center",
    justifyContent: "center"
}

const imgInnerStyle: React.CSSProperties = {
    position: 'absolute',
    background: "rgba(0,0,0,0.45)",
    color: 'white',
    fontSize: 16
}

export default function FUpload(props: IUploadProps) {
    const { item } = props
    const [loading, setLoading] = useState(false)
    const [hover, setHover] = useState(false)
    const [innerValue, setInnerValue] = useState<any>()
    const [imageUrl, setImageUrl] = useState<string | null>()
    const innerRef = useRef<any>({ value: null })

    const onChange = useChange(props)
    const style = useStyle(props)
    const className = useClassName(props)
    const disabled = useDisabled(props)

    const type = getOriginalType(item)
    const config = useConfig(props)
    const ridKeysConfig = useRidkeyConfig(config, ridKeys)
    //重设value
    const resetValue = useCallback((value: any) => {
        const { onSuccess } = config

        if (Array.isArray(value)) {
            const nextValue: any[] = []
            value.forEach(el => {
                let res = el
                if (onSuccess && el?.response) {
                    res = onSuccess(el.response)
                }
                if (Array.isArray(res)) {
                    nextValue.push(...res)
                } else {
                    nextValue.push(res)
                }
            })
            value = nextValue
        } else {
            value = (onSuccess && value?.response) ? onSuccess(value.response) : value
        }
        return value
    }, [config])

    useEffect(() => {
        let nextValue = resetValue(item.value)

        if (nextValue) {
            let tempValue = nextValue
            if (!Array.isArray(nextValue)) {
                tempValue = [nextValue]
            }
            if (util.notEquals(tempValue, resetValue(innerRef.current.value))) {
                const { filter } = config
                if (filter) {
                    if (Array.isArray(item.value)) {
                        //uid  不能为 0
                        nextValue = nextValue.map((v: any, index: number) => getItemValue(v, index + 1, item.$data, filter));
                    } else {
                        nextValue = getItemValue(nextValue, 1, item.$data, filter)
                    }
                }
                //type === img
                if (!Array.isArray(nextValue)) {
                    setImageUrl(nextValue.url)
                }
                setInnerValue(nextValue)
            }
        }
        if (!nextValue && imageUrl) {
            setImageUrl(null)
        }
    }, [item.value, item.$data, config, imageUrl, resetValue])

    const handleChange = useCallback(({ file, fileList }: any) => {
        fileList = fileList.filter((f: any) => !isRejectUploadFile(f));
        setInnerValue(fileList)

        if (file.status === 'removed') {
            if (Array.isArray(item.value)) {
                const nextValue = [...item.value]
                //下标从1开始的
                nextValue.splice(file.uid - 1, 1)
                innerRef.current.value = nextValue
                onChange(nextValue)
            } else {
                onChange(null)
            }
        } else if (file.status === 'uploading') {
            setLoading(true)
        } else if (file.status === 'done') {
            setLoading(false)
            if (type === types.img) {
                getBase64(file.originFileObj, (imageUrl: any) => {
                    setHover(false)
                    setImageUrl(imageUrl)
                    onChange(resetValue(file))
                });
            } else {
                let nextValue = [...(item.value || [])]
                nextValue.push(file)
                nextValue = resetValue(nextValue)

                innerRef.current.value = nextValue
                onChange(nextValue)
            }
        } else if (file.status === 'error') {
            config.onError?.(file.response)
            setLoading(false)
        }
    }, [item.value, resetValue, type, config.onError, onChange])
    //onerror ({type: 'fileSize', size: 1})
    //config addition: filetypes: 文件类型['image/png', 'video/mp4'], fileexts['png', 'jpg', 'jpeg'...], filesize,
    const beforeUpload = useCallback((file: any, fileList: any) => {
        //file maxcount
        const fileLength = (innerValue?.length || 0) + fileList.length;
        if (config.maxcount && fileLength > config.maxcount) {
            if (fileList[fileList.length - 1] === file) {
                message.error(`文件最多不能超过${config.maxcount}个`);
            }
            return false;
        }

        if (typeof config.beforeUpload === 'function') {
            return config.beforeUpload(file);
        }
        const { size, type, name } = file;
        let extIndex = name.lastIndexOf('.');

        if (config.fileexts && extIndex + 1 < name.length) {
            let ext = name.substring(extIndex + 1);
            if (!isIncludes(ext, config.fileexts)) {
                message.error(`仅支持${config.fileexts}文件格式`);
                return false;
            }
        }
        //filetypes
        if (config.filetypes) {
            if (!config.filetypes.includes(type)) {
                message.error(`仅支持${config.filetypes}文件格式`);
                return false;
            }
        }
        //filesize, to extends
        if (config.filesize) {
            let sizeM = size / 1024 / 1024;
            if (sizeM > config.filesize) {
                message.error(`文件大小不能超过${config.filesize}M`);
                return false;
            }
        }
        return true;
    }, [config, innerValue])

    const uploadChildren = useMemo(() => {
        if (config.maxcount && innerValue?.length >= config.maxcount) {
            return null
        } else if (config.content) {
            return config.content
        } else if (type === types.imgs || type === types.img) {
            if (imageUrl) {
                return <div style={imgContainerStyle} onMouseLeave={() => { setHover(false) }} onMouseEnter={() => { setHover(true) }}>
                    {
                        loading && <div style={{
                            ...imgContainerStyle,
                            ...imgInnerStyle
                        }}>
                            <LoadingOutlined style={{ color: "white" }} />
                        </div>
                    }
                    {
                        !loading && hover && <div style={{
                            ...imgContainerStyle,
                            ...imgInnerStyle
                        }}>
                            <EyeOutlined
                                style={{ marginRight: 16 }}
                                onClick={e => {
                                    e.stopPropagation();
                                    window.open(imageUrl, '_blank')
                                }}
                            />
                            <DeleteOutlined
                                onClick={e => {
                                    e.stopPropagation();
                                    onChange(null)
                                }}
                            />
                        </div>
                    }
                    <img src={imageUrl} alt="" style={{ width: "100%" }} />
                </div>
            }
            return loading
                ? <LoadingOutlined />
                : <PlusOutlined />
        } else if (type === types.dragger) {
            return <div>
                <UploadOutlined />
                <div style={{ color: 'rgba(0,0,0,.45)', marginTop: 10 }}>
                    {config.text || texts.dragger}
                </div>
            </div>
        } else {
            return <Button icon={<UploadOutlined />} type={type === types.primary ? "primary" : undefined}>
                {config.text || texts.upload}
            </Button>
        }
    }, [type, hover, imageUrl, config, loading, onChange, innerValue])

    const everyProps = useMemo(() => {
        let fileList = innerValue
        if (fileList) {
            fileList = Array.isArray(fileList) ? fileList : [fileList]
        }

        return {
            disabled: loading || disabled,
            className,
            style,
            fileList,
            onChange: handleChange,
            beforeUpload,
            ...ridKeysConfig
        }
    }, [disabled, className, style, loading, innerValue, handleChange, beforeUpload, ridKeysConfig])

    const uploadProps = useMemo(() => {
        switch (type) {
            case types.imgs:
                return {
                    accept: 'image/*',
                    ...everyProps,
                    multiple: true,
                    listType: "picture-card"
                }
            case types.img:
                return {
                    accept: 'image/*',
                    ...everyProps,
                    showUploadList: false,
                    listType: "picture-card"
                }
            default:
                return everyProps
        }
    }, [type, everyProps])

    return useMemo(() => {
        const Element = type === types.dragger ? Dragger : Upload

        return <Element {...uploadProps}>
            {uploadChildren}
        </Element>
    }, [uploadProps, type, uploadChildren])
}