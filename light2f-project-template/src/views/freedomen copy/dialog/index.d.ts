/// <reference types="react" />
import { IDialogProps } from "../config/type";
declare const FDialog: {
    (props: IDialogProps): JSX.Element;
    open(name: string, props?: string | IDialogProps | undefined): Promise<any> | undefined;
    close(name: string): void;
    loading(name: string, loading?: boolean): void;
};
export default FDialog;
