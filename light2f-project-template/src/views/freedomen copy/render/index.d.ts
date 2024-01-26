import { IRenderParams, IRenderProps } from "../config/type";
export default function Render(props: IRenderProps): any;
export declare const renderType = "render";
export declare const renderContainerType = "render-c";
export declare const renderTypes: string[];
export interface customValueProps {
    render: (params: IRenderParams) => {};
    isContainer?: boolean;
}
export declare const customRenders: Record<string, customValueProps>;
export declare function registerRender(type: string, render?: (params: IRenderParams) => {}, isContainer?: boolean): {
    registerRender: typeof registerRender;
};
/**
 * 删除注册的组件，不传type 删除全部
 * @param type string
 */
export declare function removeRender(type?: string): void;
