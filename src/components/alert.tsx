import { PureComponent } from "react";
import cx from "classnames";
//
import "./alert.css";

export default class Alert extends PureComponent<Props> {
  render() {
    const { children, info, success, error, warning } = this.props;

    const className = cx("alert", {
      "alert--info": info,
      "alert--success": success,
      "alert--error": error,
      "alert--warning": warning
    });

    return <div className={className}>{children}</div>;
  }
}

type Props = {
  children: React.ReactNode;
  info?: boolean;
  success?: boolean;
  error?: boolean;
  warning?: boolean;
};