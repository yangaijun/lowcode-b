import React from "react";
export declare function useChange(props: any): (value: any) => void;
export declare function useEvent(props: any): (type: string, value: any) => void;
export declare function useDisabled(props: any): boolean | undefined;
export declare function useClassName(props: any): string | undefined;
export declare function useStyle(props: any): React.CSSProperties;
export declare function useItemStyle(props: any, options: any[]): React.CSSProperties[];
export declare function useAddCallbackValue(props: any, canCallbackValue?: any): React.CSSProperties;
export declare function useFilter(props: any): string | undefined;
export declare function useChildren(props: any): any;
export declare function useConfig(props: any): any;
export declare function useRidkeyConfig(config: any, ridKeys?: any[]): any;
export declare function useOptions(props: any, innerValue?: any): {
    options: any[];
    loading: boolean;
};
export declare function useOptionNames(config: any): {
    labelname: string;
    valuename: string;
    childrenname: string;
};
export declare function useOptionIOValue(config: any, options: any[], value: any): {
    innerValue: any;
    outerValue: Function;
};
export declare function useListComponent(onChange?: Function, onEvent?: Function, data?: any[]): {
    innerData: any[];
    innerChange: (data: any) => void;
    innerEvent: (params: any) => any;
};
