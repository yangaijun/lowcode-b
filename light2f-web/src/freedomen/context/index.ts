import { ParamsType } from '../config/permission';
import { createContext } from 'react';

interface IPermission {
    isDisabled?: ParamsType
    hasPermission?: ParamsType
}

export const PermissionContext = createContext<IPermission>({ });
