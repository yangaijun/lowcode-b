/// <reference types="react" />
import { IDrawerProps } from "../config/type";
interface IFDrawerProps extends IDrawerProps {
    cancelText?: string;
    okText?: string;
}
declare const FDrawer: {
    (props: IFDrawerProps): JSX.Element;
    open(name: string, props?: string | IDrawerProps | undefined): Promise<any> | undefined;
    close(name: string): void;
    loading(name: string, loading?: boolean): void;
};
export default FDrawer;
