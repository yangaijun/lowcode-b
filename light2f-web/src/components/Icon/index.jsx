import { ReactComponent as Logo } from "./svgs/logo.svg";
import cn from 'classnames'

const WrapIcon =
    (SvgComp, initProps) =>
        ({ className, size, color, style = {}, ...props }) => {
            style = {
                ...style,
                color
            };
            return (
                <SvgComp
                    {...initProps}
                    className={cn(
                        initProps?.className,
                        className
                    )}
                    {...(typeof size === 'number' && { fontSize: size })}
                    style={style}
                    {...props}
                />
            );
        };

export const LogoIcon = WrapIcon(Logo)