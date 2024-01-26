import React from 'react';
import { isRenderComponent } from '../config/props';
import { FData, IFormProps } from '../config/type';
export interface FFormRef {
    submit: () => void;
    reset: () => void;
    set: (prop: string | FData, callback?: Function | any) => void;
    get: (prop?: string) => any;
}
declare const F: (props: React.PropsWithChildren<IFormProps> & {
    ref?: React.Ref<FFormRef>;
}) => React.ReactElement;
declare type InnerFType = typeof F;
interface InnerRInterface extends InnerFType {
    [isRenderComponent]?: boolean;
}
declare const InnerF: InnerRInterface;
export default InnerF;
