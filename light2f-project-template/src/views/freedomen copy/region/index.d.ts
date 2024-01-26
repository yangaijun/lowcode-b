import React from 'react';
import { FData, IRegionColumnItemProps, IRegionProps } from '../config/type';
import { isRenderComponent } from '../config/props';
export declare function isContainer(column?: IRegionColumnItemProps): boolean;
export interface FRegionRef {
    reset: (params?: any) => void;
    set: (prop: string | FData, callback?: Function | any) => void;
    get: (prop?: string) => any;
}
declare const R: (props: React.PropsWithChildren<IRegionProps> & {
    ref?: React.Ref<FRegionRef>;
}) => React.ReactElement;
declare type InnerRType = typeof R;
interface InnerRInterface extends InnerRType {
    [isRenderComponent]?: boolean;
}
declare const InnerR: InnerRInterface;
export default InnerR;
