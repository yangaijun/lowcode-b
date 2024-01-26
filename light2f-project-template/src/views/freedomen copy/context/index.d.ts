/// <reference types="react" />
import { ParamsType } from '../config/permission';
interface IPermission {
    isDisabled?: ParamsType;
    hasPermission?: ParamsType;
}
export declare const PermissionContext: import("react").Context<IPermission>;
export {};
