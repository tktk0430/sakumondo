import React, { Ref, forwardRef, Component } from "react";
import cx from "classnames";

type NetworkLink<LinkOptions> = (url: string, options: LinkOptions) => string;

type WindowPosition = "windowCenter" | "screenCenter";

const isPromise = (obj: any | Promise<any>) =>
  !!obj &&
  (typeof obj === "object" || typeof obj === "function") &&
  typeof obj.then === "function";

const getBoxPositionOnWindowCenter = (width: number, height: number) => ({
  left:
    window.outerWidth / 2 +
    (window.screenX || window.screenLeft || 0) -
    width / 2,
  top:
    window.outerHeight / 2 +
    (window.screenY || window.screenTop || 0) -
    height / 2,
});

const getBoxPositionOnScreenCenter = (width: number, height: number) => ({
  top: (window.screen.height - height) / 2,
  left: (window.screen.width - width) / 2,
});

function windowOpen(
  url: string,
  {
    height,
    width,
    ...configRest
  }: { height: number; width: number; [key: string]: any },
  onClose?: (dialog: Window | null) => void
) {
  const config: { [key: string]: string | number } = {
    height,
    width,
    location: "no",
    toolbar: "no",
    status: "no",
    directories: "no",
    menubar: "no",
    scrollbars: "yes",
    resizable: "no",
    centerscreen: "yes",
    chrome: "yes",
    ...configRest,
  };

  const shareDialog = window.open(
    url,
    "",
    Object.keys(config)
      .map((key) => `${key}=${config[key]}`)
      .join(", ")
  );

  if (onClose) {
    const interval = window.setInterval(() => {
      try {
        if (shareDialog === null || shareDialog.closed) {
          window.clearInterval(interval);
          onClose(shareDialog);
        }
      } catch (e) {
        /* eslint-disable no-console */
        console.error(e);
        /* eslint-enable no-console */
      }
    }, 1000);
  }

  return shareDialog;
}

interface CustomProps<LinkOptions> {
  children: React.ReactNode;
  className?: string;
  /** Disables click action and adds `disabled` class */
  disabled?: boolean;
  /**
   * Style when button is disabled
   * @default { opacity: 0.6 }
   */
  disabledStyle?: React.CSSProperties;
  forwardedRef?: Ref<HTMLButtonElement>;
  networkName: string;
  networkLink: NetworkLink<LinkOptions>;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>, link: string) => void;
  openShareDialogOnClick?: boolean;
  opts: LinkOptions;
  /**
   * URL of the shared page
   */
  url: string;
  style?: React.CSSProperties;
  windowWidth?: number;
  windowHeight?: number;
  windowPosition?: WindowPosition;
  /**
   *  Takes a function that returns a Promise to be fulfilled before calling
   * `onClick`. If you do not return promise, `onClick` is called immediately.
   */
  beforeOnClick?: () => Promise<void> | void;
  /**
   * Takes a function to be called after closing share dialog.
   */
  onShareWindowClose?: () => void;
  resetButtonStyle?: boolean;
}

type ShareButtonProps<LinkOptions> = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof CustomProps<LinkOptions>
> &
  CustomProps<LinkOptions>;

class ShareButton<LinkOptions> extends Component<
  ShareButtonProps<LinkOptions>
> {
  static defaultProps = {
    disabledStyle: { opacity: 0.6 },
    openShareDialogOnClick: true,
    resetButtonStyle: true,
  };

  openShareDialog = (link: string) => {
    const {
      onShareWindowClose,
      windowHeight = 400,
      windowPosition = "windowCenter",
      windowWidth = 550,
    } = this.props;

    const windowConfig = {
      height: windowHeight,
      width: windowWidth,
      ...(windowPosition === "windowCenter"
        ? getBoxPositionOnWindowCenter(windowWidth, windowHeight)
        : getBoxPositionOnScreenCenter(windowWidth, windowHeight)),
    };

    windowOpen(link, windowConfig, onShareWindowClose);
  };

  handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      beforeOnClick,
      disabled,
      networkLink,
      onClick,
      url,
      openShareDialogOnClick,
      opts,
    } = this.props;

    const link = networkLink(url, opts);

    if (disabled) {
      return;
    }

    event.preventDefault();

    if (beforeOnClick) {
      const returnVal = beforeOnClick();

      if (isPromise(returnVal)) {
        await returnVal;
      }
    }

    if (openShareDialogOnClick) {
      this.openShareDialog(link);
    }

    if (onClick) {
      onClick(event, link);
    }
  };

  render() {
    const {
      beforeOnClick,
      children,
      className,
      disabled,
      disabledStyle,
      forwardedRef,
      networkLink,
      networkName,
      onShareWindowClose,
      openShareDialogOnClick,
      opts,
      resetButtonStyle,
      style,
      url,
      windowHeight,
      windowPosition,
      windowWidth,
      ...rest
    } = this.props;

    const newClassName = cx(
      "react-share__ShareButton",
      {
        "react-share__ShareButton--disabled": !!disabled,
        disabled: !!disabled,
      },
      className
    );

    const newStyle = resetButtonStyle
      ? {
          backgroundColor: "transparent",
          border: "none",
          padding: 0,
          font: "inherit",
          color: "inherit",
          cursor: "pointer",
          ...style,
          ...(disabled && disabledStyle),
        }
      : {
          ...style,
          ...(disabled && disabledStyle),
        };

    return (
      <button
        {...rest}
        aria-label={rest["aria-label"] || networkName}
        className={newClassName}
        onClick={this.handleClick}
        ref={forwardedRef}
        style={newStyle}
      >
        {children}
      </button>
    );
  }
}

function createShareButton<
  OptionProps extends Record<string, any>,
  LinkOptions = OptionProps
>(
  networkName: string,
  link: (url: string, options: LinkOptions) => string,
  optsMap: (props: OptionProps) => LinkOptions,
  defaultProps: Partial<ShareButtonProps<LinkOptions> & OptionProps>
) {
  type Props = Omit<
    ShareButtonProps<LinkOptions>,
    "forwardedRef" | "networkName" | "networkLink" | "opts"
  > &
    OptionProps;

  function CreatedButton(props: Props, ref: Ref<HTMLButtonElement>) {
    const opts = optsMap(props);
    const passedProps = { ...props };

    // remove keys from passed props that are passed as opts
    const optsKeys = Object.keys(opts);
    optsKeys.forEach((key) => {
      delete (passedProps as any)[key];
    });

    return (
      <ShareButton<LinkOptions>
        {...defaultProps}
        {...passedProps}
        forwardedRef={ref}
        networkName={networkName}
        networkLink={link}
        opts={optsMap(props)}
      />
    );
  }

  CreatedButton.displayName = `ShareButton-${networkName}`;

  return forwardRef(CreatedButton);
}

export default createShareButton;
class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
  }
}

function assert(value: any, message: string) {
  if (!value) {
    throw new AssertionError(message);
  }
}

function objectToGetParams(object: {
  [key: string]: string | number | undefined | null;
}) {
  const params = Object.entries(object)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    );

  return params.length > 0 ? `?${params.join("&")}` : "";
}

function lineLink(url: string, { title }: { title?: string }) {
  assert(url, "line.url");

  return (
    "https://social-plugins.line.me/lineit/share" +
    objectToGetParams({
      url,
      text: title,
    })
  );
}

type Props = Omit<React.SVGProps<SVGSVGElement>, "width" | "height"> & {
  bgStyle?: React.CSSProperties;
  borderRadius?: number;
  iconFillColor?: string;
  round?: boolean;
  size?: number | string;
};

type IconConfig = {
  color: string;
  networkName: string;
  /** SVG path */
  path: string;
};

function createIcon(iconConfig: IconConfig) {
  const Icon: React.FC<Props> = ({
    bgStyle,
    borderRadius,
    iconFillColor,
    round,
    size,
    ...rest
  }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} {...rest}>
      {round ? (
        <circle
          cx="32"
          cy="32"
          r="31"
          fill={iconConfig.color}
          style={bgStyle}
        />
      ) : (
        <rect
          width="64"
          height="64"
          rx={borderRadius}
          ry={borderRadius}
          fill={iconConfig.color}
          style={bgStyle}
        />
      )}

      <path d={iconConfig.path} fill={iconFillColor} />
    </svg>
  );

  Icon.defaultProps = {
    bgStyle: {},
    borderRadius: 0,
    iconFillColor: "white",
    size: 64,
  };

  return Icon;
}
export const LineShareButton = createShareButton<{ title?: string }>(
  "line",
  lineLink,
  (props) => ({
    title: props.title,
  }),
  {
    windowWidth: 500,
    windowHeight: 500,
  }
);

export const LineIcon = createIcon({
  color: "#00b800",
  networkName: "line",
  path: "M52.62 30.138c0 3.693-1.432 7.019-4.42 10.296h.001c-4.326 4.979-14 11.044-16.201 11.972-2.2.927-1.876-.591-1.786-1.112l.294-1.765c.069-.527.142-1.343-.066-1.865-.232-.574-1.146-.872-1.817-1.016-9.909-1.31-17.245-8.238-17.245-16.51 0-9.226 9.251-16.733 20.62-16.733 11.37 0 20.62 7.507 20.62 16.733zM27.81 25.68h-1.446a.402.402 0 0 0-.402.401v8.985c0 .221.18.4.402.4h1.446a.401.401 0 0 0 .402-.4v-8.985a.402.402 0 0 0-.402-.401zm9.956 0H36.32a.402.402 0 0 0-.402.401v5.338L31.8 25.858a.39.39 0 0 0-.031-.04l-.002-.003-.024-.025-.008-.007a.313.313 0 0 0-.032-.026.255.255 0 0 1-.021-.014l-.012-.007-.021-.012-.013-.006-.023-.01-.013-.005-.024-.008-.014-.003-.023-.005-.017-.002-.021-.003-.021-.002h-1.46a.402.402 0 0 0-.402.401v8.985c0 .221.18.4.402.4h1.446a.401.401 0 0 0 .402-.4v-5.337l4.123 5.568c.028.04.063.072.101.099l.004.003a.236.236 0 0 0 .025.015l.012.006.019.01a.154.154 0 0 1 .019.008l.012.004.028.01.005.001a.442.442 0 0 0 .104.013h1.446a.4.4 0 0 0 .401-.4v-8.985a.402.402 0 0 0-.401-.401zm-13.442 7.537h-3.93v-7.136a.401.401 0 0 0-.401-.401h-1.447a.4.4 0 0 0-.401.401v8.984a.392.392 0 0 0 .123.29c.072.068.17.111.278.111h5.778a.4.4 0 0 0 .401-.401v-1.447a.401.401 0 0 0-.401-.401zm21.429-5.287c.222 0 .401-.18.401-.402v-1.446a.401.401 0 0 0-.401-.402h-5.778a.398.398 0 0 0-.279.113l-.005.004-.006.008a.397.397 0 0 0-.111.276v8.984c0 .108.043.206.112.278l.005.006a.401.401 0 0 0 .284.117h5.778a.4.4 0 0 0 .401-.401v-1.447a.401.401 0 0 0-.401-.401h-3.93v-1.519h3.93c.222 0 .401-.18.401-.402V29.85a.401.401 0 0 0-.401-.402h-3.93V27.93h3.93z",
});
