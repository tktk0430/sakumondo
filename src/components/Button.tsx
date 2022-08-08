import classNames from "classnames";
import { marginStyle, TMargin } from "./margin";

type TButtonProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  disabled?: boolean;
  width?: "small" | "middle" | "large" | "full";
  color?: "red" | "green";
} & { margin?: TMargin };

const Button = (props: TButtonProps) => {
  const {
    className,
    disabled,
    children,
    onClick,
    width,
    color,
    style,
    margin,
    ...restProps
  } = props;
  const innerCN = classNames(
    "button-base",
    className,
    { "button-disabled": disabled },
    { [`button-width-${width}`]: !!width },
    { [`button-color-${color}`]: !!color }
  );
  const innerOnClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (disabled) return;
    onClick?.(e);
  };

  return (
    <div
      className={innerCN}
      onClick={innerOnClick}
      style={{ ...style, ...marginStyle(margin) }}
      {...restProps}
    >
      {children}
    </div>
  );
};

export { Button };
