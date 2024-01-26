import React from "react"
import { AutoCompleteProps, ButtonProps, FormProps, TreeProps, CascaderProps, CheckboxProps, DatePickerProps, DividerProps, DropDownProps, ImageProps, InputNumberProps, InputProps, ProgressProps, RadioProps, SelectProps, SliderSingleProps, TagProps, TreeSelectProps, UploadProps, AvatarProps, TableProps, ModalProps, StepsProps, MentionProps, DrawerProps, TimePickerProps, TimeRangePickerProps, SwitchProps, SegmentedProps, AlertProps } from "antd"

export type IFunType = (params: IFunParams) => boolean

export type IEventType = (params: IEventParams) => void | undefined | null | FData

export type IListEventType = (params: IListEventParams) => void | undefined | null | FData

export type IDisabledType = boolean | ((params: IFunParams) => boolean)

export type IStyleType = React.CSSProperties | ((params: IFunParams) => React.CSSProperties)

export type IRenderType = IRenderParams

export type FData = Record<string, any>

//触发 onchange 事件的方式
export enum EChangeEventType {
    BLUR = 'blur',
    INPUT = 'input' 
}

export interface IRenderParams extends IDefaultParams {
    data: FData,
    $base: {
        onChange: (value: any) => void,
        onEvent: (type: string, value: any) => void,
        shouldUpdate: ((preData: FData, currentData: FData) => boolean)
        config: FData
    }
}

export interface IFunParams {
    value: any,
    data: FData
}

export interface IEventParams {
    prop: string,
    type: string,
    value: any,
    row: FData,
    [key: string]: any
}

export interface IListEventParams extends IEventParams {
    row: { $index: number, $key: string } & FData
}

export interface IDefaultParams {
    value?: any,
    className?: string,
    style?: IStyleType,
    disabled?: IDisabledType
}

export type IOptionParams = {
    label: string,
    value: any,
    option?: any,
    [key: string]: any
} | string | FData

export type IOptionType = IOptionParams | ((params: { data: FData, value: any, resolve: (p: IOptionParams) => void }) => void)

export interface IRegionColumnItemProps {
    prop?: '$reset' | string,
    type?: string | ((params: IFunParams) => string),
    load?: boolean | IFunType,
    $data?: FData,
    $preData?: FData,

    [key: string]: any
}

export type IRegionColumnsType = (
    IAutoCompleteItemProps | IButtonItemProps | ICascaderItemProps | ICheckboxsItemProps | IDateItemProps | IDateRangeItemProps | IDividerItemProps | IDropdownItemProps
    | IImageItemProps | IImgItemProps | IInputItemProps | IInputNumberItemProps | IProgressItemProps | IRadiosItemProps | IRateItemProps | ISelectItemProps
    | ISliderItemProps | ISwitchItemProps | ITagItemProps | ITextItemProps | ITreeItemProps | ITreeSelectItemProps | IUploadItemProps
)
export interface IRegionProps {
    data?: FData,
    columns: IRegionColumnsType[],
    className?: string,
    style?: React.CSSProperties,
    onEvent?: IEventType,
    onChange?: (data: FData) => void
}

export type ITableColumnsType = IRegionColumnsType & {
    width?: number,
    fixed?: boolean,
    ellipsis?: boolean
}
export interface ITableProps {
    data?: FData[],
    columns: ITableColumnsType[],
    className?: string,
    pagination?: any,
    config?: TableProps<any> & { 
        selection?: boolean, 
        selectionType?: 'checkbox' | 'radio',
        disabled?: boolean |  ((row: any) => boolean), 
        align?: 'left' | 'right' | 'center' 
    },
    style?: React.CSSProperties,
    onChange?: (data: FData) => void,
    onEvent?: IEventType
}

export interface IDialogProps {
    name: string,
    children?: React.ReactElement,
    onOk?: Function,
    onCancel?: Function,
    noForm?: boolean,
    className?: string,
    wrapClassName?: string,
    bodyStyle?: React.CSSProperties,
    title?: string,
    width?: number,
    footer?: React.ReactElement | null,
    config?: ModalProps,
    [name: string]: any
}

export interface IDrawerProps {
    name: string,
    children?: React.ReactElement,
    onOk?: Function,
    onCancel?: Function,
    noForm?: boolean,
    title?: string,
    width?: number,
    footer?: React.ReactElement | null,
    config?: {
        cancelText?: string,
        cancelButtonProps: ButtonProps,
        okText?: string,
        okButtonProps: ButtonProps,
    } & DrawerProps,
    [name: string]: any
}

export interface IListProps {
    data?: any[],
    columns: IRegionColumnsType[],
    className?: string,
    style?: React.CSSProperties,
    onEvent?: IEventType,
    onChange?: (data: FData) => void
}

export type IFormColumnsType = IRegionColumnsType & {
    label?: string,
    span?: number,
    rule: string | FData | ((params: { data: FData, value: any }) => Promise<string | void>)
}
export interface IFormProps {
    pathSplitChar?: string,
    columns: IFormColumnsType[],
    style?: React.CSSProperties,
    className?: string,
    data?: FData,
    onSubmit?: (data: FData, submitColumn?: IEventParams) => void,
    onEvent?: IEventType,
    onChange?: (data: FData) => void,
    config?: FormProps
}

export interface IRenderProps {
    children?: React.ReactElement[],
    onChange?: IFunType,
    item: IRegionColumnItemProps & IDefaultParams & {
        $data: FData,
        $preData: FData
    }
}

export type IAutoCompleteItemProps = IRegionColumnItemProps & IDefaultParams & {
    type: `autocomplete${string}`,
    value?: string | number,
    placeholder?: string,
    options?: IOptionType,
    config?: AutoCompleteProps,
    [key: string]: any
}
export interface IAutoCompleteProps {
    onChange?: IFunType
    item: IAutoCompleteItemProps
}

export type IAvatarItemProps = IRegionColumnItemProps & IDefaultParams & {
    type: string,
    value?: string | number,
    config?: AvatarProps,
    [key: string]: any
}
export interface IAvatarProps {
    onChange?: IFunType
    item: IAvatarItemProps
}

export type IButtonItemProps = IRegionColumnItemProps & IRegionColumnItemProps & {
    type: `button-primary${string}` | `button-dashed${string}` | `button-text${string}` | `button-link${string}` | `button${string}`,
    value?: string,
    config?: ButtonProps,
    [key: string]: any
}

export type IAlertItemProps = IRegionColumnItemProps & IRegionColumnItemProps & {
    type: string,
    value?: string,
    config?: AlertProps,
    [key: string]: any
}


export interface IButtonProps {
    onEvent?: IFunType,
    item: IButtonItemProps
}

export interface IAlertProps {
    item: IAlertItemProps
}

export type ICascaderItemProps = IRegionColumnItemProps & IRegionColumnItemProps & {
    value?: any[],
    placeholder?: string,
    options?: IOptionType,
    config?: CascaderProps<any>,
    [key: string]: any
}
export interface ICascaderProps {
    onChange?: IFunType,
    item: ICascaderItemProps
}

export type ICheckboxsItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: string | number,
    placeholder?: string,
    options?: IOptionType,
    config?: CheckboxProps,
    [key: string]: any
}
export interface ICheckboxsProps {
    onChange?: IFunType,
    item: ICheckboxsItemProps
}

export type IMentionsItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: string | number,
    placeholder?: string,
    options?: IOptionType,
    config?: MentionProps,
    [key: string]: any
}
export interface IMentionsProps {
    onChange?: IFunType,
    item: IMentionsItemProps
}

export type IDateItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: string,
    placeholder?: string,
    config?: DatePickerProps,
    [key: string]: any
}
export interface IDateProps {
    onChange?: IFunType,
    item: IDateItemProps
}

export type ITimePickerItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: string,
    placeholder?: string,
    config?: TimePickerProps,
    [key: string]: any
}
export interface ITimePickerProps {
    onChange?: IFunType,
    item: ITimePickerItemProps
}

export type IDateRangeItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: [Date, Date],
    placeholder?: string,
    config?: DatePickerProps,
    [key: string]: any
}
export interface IDateRangeProps {
    onChange?: IFunType,
    item: IDateRangeItemProps
}

export type ITimeRangeItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: [Date, Date],
    placeholder?: string,
    config?: TimeRangePickerProps,
    [key: string]: any
}
export interface ITimeRangeProps {
    onChange?: IFunType,
    item: ITimeRangeItemProps
}

export type IDividerItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: string | number,
    config?: DividerProps,
    [key: string]: any
}
export interface IDividerProps {
    item: IDividerItemProps
}

export type IDropdownItemProps = IRegionColumnItemProps & IDefaultParams & {
    text?: string,
    value?: string,
    config?: {
        content: React.ReactElement
    } & DropDownProps,
    [key: string]: any
}
export interface IDropdownProps {
    onEvent?: IFunType,
    item: IDropdownItemProps
}

export type IImageItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: string | number,
    config?: ImageProps,
    [key: string]: any
}
export interface IImageProps {
    item: IImageItemProps
}

export type IImgItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: string | number,
    [key: string]: any
}
export interface IImgProps {
    item: IImgItemProps
}

export type IInputItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: string,
    placeholder?: string,
    config?: InputProps,
    [key: string]: any
}
export interface IInputProps {
    onChange?: IFunType,
    item: IInputItemProps
}

export type IInputNumberItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: number,
    placeholder?: string,
    config?: InputNumberProps,
    [key: string]: any
}
export interface IInputNumberProps {
    onChange?: IFunType,
    item: IInputNumberItemProps
}

export type IProgressItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: number,
    config?: ProgressProps,
    [key: string]: any
}
export interface IProgressProps {
    item: IProgressItemProps
}

export type IRadiosItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: any,
    placeholder?: string,
    options?: IOptionType,
    config?: RadioProps
    [key: string]: any
}

export type ISegmentedItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: any,
    placeholder?: string,
    options?: IOptionType,
    config?: SegmentedProps,
    [key: string]: any
}
export interface IRadiosProps {
    onChange?: IFunType,
    item: IRadiosItemProps
}

export interface ISegmentedProps {
    onChange?: IFunType,
    item: ISegmentedItemProps
}

export type IRateItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: number,
    config?: RadioProps
    [key: string]: any
}
export interface IRateProps {
    onChange?: IFunType,
    item: IRateItemProps
}

export type ISelectItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: any | any[],
    placeholder?: string,
    options?: IOptionType,
    config?: {
        filterable?: boolean,
        labelname?: string,
        debounceWait?: number,
        valuename?: string,
        optionvalue?: boolean
    } & SelectProps<any>
    [key: string]: any
}
export interface ISelectProps {
    onChange?: IFunType,
    item: ISelectItemProps
}

export type ISliderItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: string | number,
    placeholder?: string,
    config?: SliderSingleProps
    [key: string]: any
}
export interface ISliderProps {
    onChange?: IFunType,
    item: ISliderItemProps
}

export type ISwitchItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: any,
    config?: {
        checkedValue?: any,
        uncheckedValue?: any
    } & SwitchProps
    [key: string]: any
}
export interface ISwitchProps {
    onChange?: IFunType,
    item: ISwitchItemProps
}

export type ITagItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: any,
    config?: TagProps
    [key: string]: any
}
export interface ITagProps {
    item: ITagItemProps
}

export type ITextItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: any,
    config?: {
        tooltip?: boolean,
        maxlength?: number
    } & FData
    [key: string]: any
}
export interface ITextProps {
    item: ITextItemProps
}

export type ITreeItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: any | any[],
    options?: IOptionType,
    config?: TreeProps
    [key: string]: any
}
export interface ITreeProps {
    onChange?: IFunType,
    item: ITreeItemProps
}

export type IStpesItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: number,
    options?: IOptionType,
    config?: StepsProps
    [key: string]: any
}
export interface IStpesProps {
    onChange?: IFunType,
    item: IStpesItemProps
}

export type ITreeSelectItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: any | any[],
    placeholder?: string,
    options?: IOptionType,
    config?: TreeSelectProps<any>
    [key: string]: any
}
export interface ITreeSelectProps {
    onChange?: IFunType,
    item: ITreeSelectItemProps
}

export type IUploadItemProps = IRegionColumnItemProps & IDefaultParams & {
    value?: any | any[],
    config?: UploadProps
    [key: string]: any
}
export interface IUploadProps {
    onChange?: IFunType,
    item: IUploadItemProps
}
