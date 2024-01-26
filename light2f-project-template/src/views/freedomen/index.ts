import List from './list'
import Form from './form'
import FormList from './form/formlist'
import Region from './region'
import Search from './search'
import Table from './table'
import Dialog from './dialog'
import Drawer from './drawer'
import { PermissionContext } from './context'

import { registerRender, removeRender } from './render';
import { registerRules, removeRules } from './config/rule';
import { setPermission, clearPermission, setDisabled, clearDisabled } from './config/permission';
import { setDefaultStyles, clearDefaultStyles } from './config/style';
import { setDefaultConfigs, clearDefaultConfigs } from './config/config';
import { setDefaultClasses, clearDefaultClasses } from './config/class';

export { List, Form, FormList, Table, Region, Search, Dialog, Drawer, PermissionContext }

const sets = {
    setDisabled,
    setPermission,
    setDefaultStyles,
    setDefaultConfigs,
    setDefaultClasses,

    clearDisabled,
    clearPermission,

    clearDefaultStyles,
    clearDefaultConfigs,
    clearDefaultClasses,

    registerRules,
    removeRules,

    registerRender,
    removeRender
}

export default sets;
