type TButtonProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { disabled?: boolean };

const Button = (props: TButtonProps) => {
  const { className, disabled, children, onClick, ...restProps } = props;
  const innerCN = `${className} ${disabled && "disabled"}`;
  const innerOnClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (disabled) return;
    onClick?.(e);
  };
  return (
    <div className={innerCN} onClick={innerOnClick} {...restProps}>
      {children}
    </div>
  );
};

export { Button };
