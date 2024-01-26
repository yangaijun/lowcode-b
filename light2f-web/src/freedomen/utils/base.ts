import { customTypeProp, proxyEvents, submitEventType } from "../config/props";
import { grammar as configGrammar, getDefaultConfigs } from "../config/config";
import { grammar as classGrammar, getDefaultClasses } from "../config/class";
import { grammar as styleGrammar, getDefaultStyles } from "../config/style";
import { renderType } from "../render";
import { IRegionColumnItemProps } from "../config/type";

function toRenderType(render: any) {
    return render ? renderType : ''
}
//type 全貌
export function getFullType(item: IRegionColumnItemProps): string {
    if (!item.type) {
        return toRenderType(item.render);
    }
    let columnType = item.type
    if (typeof columnType === 'function') {
        const data = item.$data || {}
        columnType = columnType({ value: item.value, data })
        if (!columnType) {
            throw new Error('function type, return string');
        }
    }
    return columnType || ''
}
//button-primary@any => return "button-primary" Or "any"
export function getTypeOrName(item: IRegionColumnItemProps, key = 0) {
    return getFullType(item).split('@')[key]
}
//button-primary@any => return "button-primary" 
export function getOriginalType(item: IRegionColumnItemProps) {
    return getTypeOrName(item)
}
export function getOptionStyle(option: any, item: IRegionColumnItemProps) {
    const { itemStyle, $data: data, value } = item
    let newItemStyle
    if (typeof itemStyle === 'function') {
        newItemStyle = itemStyle({ data: data, option: option, value: value });
    } else if (itemStyle) {
        newItemStyle = itemStyle;
    }
    return newItemStyle
}

function getGlobalConfig(config: any, grammar: any) {
    const globalConfig: any = {};
    for (let key in config) {
        if (key.indexOf(grammar.global) === 0) {
            globalConfig[key] = config[key];
        }
    }
    return globalConfig;
}

function getWildcardConfig(config: any, key: string) {
    const wildcardKey = Object.keys(config).find(k => {
        return key.indexOf(k) === 0;
    });
    if (wildcardKey) {
        return config[wildcardKey];
    }
}

const defaultConfigRidkeys = [submitEventType, proxyEvents]

export function getConfig(item: IRegionColumnItemProps, onEvent: Function) {
    let type = item[customTypeProp] || getFullType(item), newConfig: any = {};
    const [DefaultConfigs, DefaultWildcardConfigs] = getDefaultConfigs()

    const GlobalConfig = getGlobalConfig(DefaultConfigs, configGrammar);

    if (Object.keys(GlobalConfig).length) {
        let configName = getTypeOrName(item, 1);

        for (let key in GlobalConfig) {
            if (key.includes(configName)) {
                newConfig = DefaultConfigs[key];
                break;
            }
        }
    }
    //wildcardConfig upload* button*, ...
    let wildcardConfigs = getWildcardConfig(DefaultWildcardConfigs, type);
    if (wildcardConfigs) {
        newConfig = {
            ...newConfig,
            ...wildcardConfigs
        };
    }
    //defaultConfig date-month, date-year, ...
    if (DefaultConfigs[type]) {
        newConfig = {
            ...newConfig,
            ...DefaultConfigs[type]
        };
    }
    newConfig = {
        ...newConfig,
        ...item.config
    };
    //you can register event in config; exp: onDoubleCilck, onClick...  'onClick'/['onClick']/['onDoubleClick','onClick']
    if (newConfig[proxyEvents]) {
        const registerEvent = (key: string) => {
            newConfig[key] = () => {
                onEvent(key, item.value);
            };
        };
        if (Array.isArray(newConfig[proxyEvents])) {
            newConfig[proxyEvents].forEach((key: string) => {
                registerEvent(key);
            });
        } else if (typeof newConfig[proxyEvents] === 'string') {
            registerEvent(newConfig[proxyEvents]);
        }
    }

    defaultConfigRidkeys.forEach(key => {
        delete newConfig[key];
    });

    return newConfig;
};

export function getClass(item: IRegionColumnItemProps) {
    let _type = getFullType(item);
    const [DefaultClasses, DefaultWildcardClasses] = getDefaultClasses()
    const GlobalClass = getGlobalConfig(DefaultClasses, classGrammar);
    if (Object.keys(GlobalClass).length) {
        let configName = getTypeOrName(item, 1);

        for (let key in GlobalClass) {
            if (key.includes(configName)) {
                return DefaultClasses[key];
            }
        }
    }
    if (DefaultClasses[_type]) {
        return DefaultClasses[_type];
    }
    let wildcardClasses = getWildcardConfig(DefaultWildcardClasses, _type);
    if (wildcardClasses) return wildcardClasses;
};

const widthStr = '@' + styleGrammar.width;

export function getStyle(item: any) {
    let newStyle: any = {}, _type = getFullType(item);
    const [DefaultStyles, DefaultWildcardStyles] = getDefaultStyles();
    const GlobalStyle = getGlobalConfig(DefaultStyles, styleGrammar);

    if (Object.keys(GlobalStyle).length) {
        let configName = getTypeOrName(item, 1);

        for (let key in GlobalStyle) {
            if (key.includes(configName)) {
                newStyle = DefaultStyles[key];
                break;
            }
        }
    }
    //wildcardStyle  div* , text-div*
    let wildcardStyles = getWildcardConfig(DefaultWildcardStyles, _type);
    if (wildcardStyles) {
        newStyle = {
            ...newStyle,
            ...wildcardStyles
        };
    }
    //defaultStyle  div, text-div
    if (DefaultStyles[_type]) {
        newStyle = {
            ...newStyle,
            ...DefaultStyles[_type]
        };
    }
    //style  width,  *@w120 => {width: 120}
    let _index = _type.indexOf(widthStr);
    if (_index !== -1) {
        let width = _type.substring(_index + widthStr.length);
        newStyle.width = parseInt(width);
    }
    return newStyle
}


function canSearch(value: any) {
    return typeof value === 'string' || typeof value === 'number'
}

export function filterNode(input = '', option: any, labelname = "label", valuename = "value"): boolean {
    if (canSearch(option[labelname])) {
        return String(option[labelname]).toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    if (canSearch(option[valuename])) {
        return String(option[labelname]).toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    return false
}