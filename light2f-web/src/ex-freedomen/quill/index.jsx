import { message, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill, { Quill as QuillEntity } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImageBlot } from './customUploadImg'

QuillEntity.register({
    'formats/image': ImageBlot
}, true);

function isBase64(data) {

}

function base64ToFile(data) {
    let binary = window.atob(data.split(',')[1]);
    let mime = data.split(',')[0].match(/:(.*?);/)[1];
    let array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    let fileData = new Blob([new Uint8Array(array)], {
        type: mime,
    });
    let file = new File([fileData], `${new Date().getTime()}.png`, {
        type: mime
    });
    return file;
}


const upload = (formData, uploadUrl, onSuccess, headers, callBack) => {
    try {
        let xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xhr = new window.ActiveXObject("Microsoft.XMLHttpRequest");
        } else {
            console.log('浏览器版本过低！')
            return;
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                const result = xhr.responseText
                if (xhr.status === 200) {
                    if (onSuccess) {
                        callBack(onSuccess(result))
                    } else {
                        callBack(result)
                    }
                }
            }
        };
        xhr.withCredentials = false;
        xhr.open("POST", uploadUrl, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        if (headers) {
            for (let key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }
        xhr.send(formData);
    } catch (error) {
        console.warn('上传出错！', error);
    }
}

const Quiller = (props) => {
    const quill = useRef()
    const [loading, setLoading] = useState(false)
    const { value = "", style, className, onChange, config } = props

    const callBack = useCallback((src) => {
        const range = quill.current.getEditor().getSelection();
        quill.current.getEditor().insertEmbed(range.index, 'image', {
            src: src,
            style: 'max-width: 100%',
            alt: 'img'
        });
        setLoading(false)
        quill.current.getEditor().setSelection(range.index + 1);
    }, [quill])

    const uploadFile = useCallback((file) => {
        if (file.size > 2 * 1000 * 1000) {
            message.error('请上传小于 2M 图片')
        } else {
            setLoading(true)
            const formData = new FormData();
            const { name = 'file', action, onSuccess, headers } = config
            formData.append(name, file);
            upload(formData, action, onSuccess, headers, callBack)
        }
    }, [callBack, config])

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
            uploadFile(input.files[0])
        };
    }, [uploadFile])

    useEffect(() => {
        quill.current.getEditor()?.clipboard?.addMatcher("img", (_, delta) => {
            if (delta.ops.every(op => op.insert?.image?.src)) {
                return delta
            }

            setLoading(true)
            delta.ops.forEach(op => { 
                !op.insert?.image?.src && uploadFile(base64ToFile(op.insert?.image))
            })
            delta.ops.length = 0
            return delta
        })
    }, [uploadFile])

    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [
                        { list: 'ordered' },
                        { list: 'bullet' },
                        { indent: '-1' },
                        { indent: '+1' }
                    ],
                    ['link', 'image'],
                    [{
                        'background': ['rgb(  0,   0,   0)', 'rgb(230,   0,   0)', 'rgb(255, 153,   0)',
                            'rgb(255, 255,   0)', 'rgb(  0, 138,   0)', 'rgb(  0, 102, 204)',
                            'rgb(153,  51, 255)', 'rgb(255, 255, 255)', 'rgb(250, 204, 204)',
                            'rgb(255, 235, 204)', 'rgb(255, 255, 204)', 'rgb(204, 232, 204)',
                            'rgb(204, 224, 245)', 'rgb(235, 214, 255)', 'rgb(187, 187, 187)',
                            'rgb(240, 102, 102)', 'rgb(255, 194, 102)', 'rgb(255, 255, 102)',
                            'rgb(102, 185, 102)', 'rgb(102, 163, 224)', 'rgb(194, 133, 255)',
                            'rgb(136, 136, 136)', 'rgb(161,   0,   0)', 'rgb(178, 107,   0)',
                            'rgb(178, 178,   0)', 'rgb(  0,  97,   0)', 'rgb(  0,  71, 178)',
                            'rgb(107,  36, 178)', 'rgb( 68,  68,  68)', 'rgb( 92,   0,   0)',
                            'rgb(102,  61,   0)', 'rgb(102, 102,   0)', 'rgb(  0,  55,   0)',
                            'rgb(  0,  41, 102)', 'rgb( 61,  20,  10)']
                    }],
                    [{
                        'color': ['rgb(  0,   0,   0)', 'rgb(230,   0,   0)', 'rgb(255, 153,   0)',
                            'rgb(255, 255,   0)', 'rgb(  0, 138,   0)', 'rgb(  0, 102, 204)',
                            'rgb(153,  51, 255)', 'rgb(255, 255, 255)', 'rgb(250, 204, 204)',
                            'rgb(255, 235, 204)', 'rgb(255, 255, 204)', 'rgb(204, 232, 204)',
                            'rgb(204, 224, 245)', 'rgb(235, 214, 255)', 'rgb(187, 187, 187)',
                            'rgb(240, 102, 102)', 'rgb(255, 194, 102)', 'rgb(255, 255, 102)',
                            'rgb(102, 185, 102)', 'rgb(102, 163, 224)', 'rgb(194, 133, 255)',
                            'rgb(136, 136, 136)', 'rgb(161,   0,   0)', 'rgb(178, 107,   0)',
                            'rgb(178, 178,   0)', 'rgb(  0,  97,   0)', 'rgb(  0,  71, 178)',
                            'rgb(107,  36, 178)', 'rgb( 68,  68,  68)', 'rgb( 92,   0,   0)',
                            'rgb(102,  61,   0)', 'rgb(102, 102,   0)', 'rgb(  0,  55,   0)',
                            'rgb(  0,  41, 102)', 'rgb( 61,  20,  10)']
                    }]
                ],
                handlers: {
                    image: imageHandler
                }
            }
        }
    }, [imageHandler])

    return <Spin spinning={loading} >
        <ReactQuill
            theme="snow"
            ref={quill}
            modules={modules}
            value={value}
            placeholder={props.placeholder}
            style={{ marginBottom: 42, height: 280, ...style }}
            className={className}
            onChange={onChange}
            {...config}
        />
    </Spin>
}

export const Quill = ({ value, $base: { onChange, style, placeholder, class: className, config } }) => {
    return <Quiller
        value={value}
        onChange={onChange}
        style={style}
        className={className}
        placeholder={placeholder}
        config={config}
    />
}
