import * as React from "react";
import * as PropTypes from "prop-types";

import ReactLazyLoad from "react-lazyload";

import Icon from "../Icon";

export interface DataProps {
  /**
   * Toggle LazyLoad mode open, powerful base on [react-lazyload](https://github.com/jasonslyvia/react-lazyload).
   */
  useLazyLoad?: boolean;
  /**
   * Use Div backgroundImage.
   */
  useDivContainer?: boolean;
  /**
   * Once the lazy loaded component is loaded, do not detect scroll/resize event anymore. Useful for images or simple components.
   */
  once?: boolean;
  /**
   * Say if you want to preload a component even if it's 100px below the viewport (user have to scroll 100px more to see this component), you can set `offset` props to `100`. On the other hand, if you want to delay loading a component even if it's top edge has already appeared at viewport, set `offset` to negative number.
   */
  offset?: number | number[];
  /**
   * Listen and react to scroll event.
   */
  scroll?: boolean;
  /**
   * Respond to `resize` event, set it to `true` if you do need LazyLoad listen resize event.
   */
  resize?: boolean;
  /**
   * If lazy loading components inside a overflow container, set this to `true`. Also make sure a `position` property other than `static` has been set to your overflow container.
   */
  overflow?: boolean;
  /**
   * By default, LazyLoad will have all event handlers debounced in 300ms for better performance. You can disable this by setting `debounce` to `false`, or change debounce time by setting a number value.
   */
  debounce?: boolean | number;
  /**
   * If you prefer `throttle` rather than `debounce`, you can set this props to `true` or provide a specific number.
   */
  throttle?: boolean | number;
}

export interface ImageProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ImageState {
  showEmptyImage?: boolean;
}

class Placeholder extends React.Component<React.HTMLAttributes<HTMLImageElement>, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { ...attributes } = this.props;
    const { theme } = this.context;
    return (
      <div {...attributes as any} style={{ background: theme.chromeMedium }}>
        <Icon
          style={{
            color: theme.baseMedium,
            fontSize: 80,
            verticalAlign: "middle",
            display: "block"
          }}
          hoverStyle={{}}
        >
          &#xEB9F;
        </Icon>
      </div>
    );
  }
}

export class Image extends React.Component<ImageProps, ImageState> {
  static defaultProps: ImageProps = {
    useLazyLoad: false,
    useDivContainer: false,
    once: true,
    offset: 0,
    scroll: true,
    overflow: false,
    throttle: 60
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  state: ImageState = {
    showEmptyImage: false
  };

  errorHandler = (e: any) => this.setState({ showEmptyImage: true });

  render() {
    const {
      useLazyLoad,
      useDivContainer,
      once, scroll, offset, overflow, resize, debounce, throttle,
      ...attributes
    } = this.props;
    const placeholder = (attributes.placeholder || <Placeholder {...attributes as any} />) as any;

    const ImageOrDiv = () => (useDivContainer
      ?
      <div
        {...attributes as React.HTMLAttributes<HTMLDivElement>}
        style={{
          background: `url(${attributes.src}) no-repeat center center / cover`,
          ...attributes.style
        }}
      />
      : <img {...attributes as any} onError={this.errorHandler} />
    );

    if (!attributes.src || this.state.showEmptyImage) {
      return useLazyLoad ? placeholder : null;
    }

    if (useLazyLoad) {
      return (
        <ReactLazyLoad
          {...{
            once,
            scroll,
            offset,
            overflow,
            resize,
            debounce,
            throttle
          }}
          height={attributes.height}
          placeholder={placeholder}
        >
          <ImageOrDiv />
        </ReactLazyLoad>
      );
    }

    return <ImageOrDiv />;
  }
}


export default Image;