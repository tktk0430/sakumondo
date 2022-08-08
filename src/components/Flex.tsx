import { marginStyle, TMargin } from "./margin";

type TFlexProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { justifyContent?: "center" | "right" } & { margin?: TMargin };

const Flex = (props: TFlexProps) => {
  const { children, justifyContent, style, margin, ...restProps } = props;
  return (
    <div
      style={{
        ...style,
        ...marginStyle(margin),
        display: "flex",
        justifyContent,
      }}
      {...restProps}
    >
      {children}
    </div>
  );
};
export { Flex };
