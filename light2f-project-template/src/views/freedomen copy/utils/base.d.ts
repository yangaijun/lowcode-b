import { IRegionColumnItemProps } from "../config/type";
export declare function getFullType(item: IRegionColumnItemProps): string;
export declare function getTypeOrName(item: IRegionColumnItemProps, key?: number): string;
export declare function getOriginalType(item: IRegionColumnItemProps): string;
export declare function getOptionStyle(option: any, item: IRegionColumnItemProps): any;
export declare function getConfig(item: IRegionColumnItemProps, onEvent: Function): any;
export declare function getClass(item: IRegionColumnItemProps): any;
export declare function getStyle(item: any): any;
export declare function filterNode(input: string | undefined, option: any, labelname?: string, valuename?: string): boolean;
