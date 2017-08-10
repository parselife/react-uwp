import * as React from "react";
import * as ReactDOM from "react-dom";

export interface RenderToBodyProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactElement<any>;
}

export default class RenderToBody extends React.Component<RenderToBodyProps> {
  rootElm = document.createElement("div");
  componentDidMount() {
    const { style, className } = this.props;
    Object.assign(this.rootElm, className ? { style, className } : { style });

    document.body.appendChild(this.rootElm);
    this.renderComponent();
  }

  componentDidUpdate() {
    this.renderComponent();
    const { style, className } = this.props;
    Object.assign(this.rootElm, className ? { style, className } : { style });
  }

  componentWillUnmount() {
    if (this.props.children) {
      this.unRenderComponent();
    }
    document.body.removeChild(this.rootElm);
    this.rootElm = null;
  }

  renderComponent = () => {
    const { children } = this.props;
    if (children) {
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        children,
        this.rootElm
      );
    }
  }

  unRenderComponent = () => {
    if (!this.rootElm) return;
    ReactDOM.unmountComponentAtNode(this.rootElm);
  }

  getRootElement = () => this.rootElm;

  render() {
    return null as any;
  }
}
