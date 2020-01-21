import React, { Component } from "react";
import { Button, Drawer } from "antd";
import _ from "lodash";
import { Inject } from "../../utils";
import * as styles from "./index.module.scss";

@Inject(({ globalStore: model }) => ({
  model
}))
class MyDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: _.uniqueId("drawer_"),
      childrenDrawer: false,
      childrenDrawerData: {}
    };
  }

  componentDidMount() {}

  onClose = () => {
    this.props.model.closeModal();
  };

  showChildrenDrawer = (title, childrenDrawerData = {}) => {
    this.setState({
      childrenDrawer: title,
      childrenDrawerData
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false
    });
  };

  render() {
    const { id } = this.state;
    const {
      className,
      title = "title",
      width = "60%",
      children,
      childs = []
    } = this.props;

    return (
      <Drawer
        className={className}
        id={id}
        title={
          <div className={styles.header}>
            {title}
            {childs.map(
              item =>
                item.entry && (
                  <Button
                    key={item.title}
                    type="primary"
                    onClick={() => this.showChildrenDrawer(item.title)}
                  >
                    {item.entry}
                  </Button>
                )
            )}
          </div>
        }
        width={width}
        closable={true}
        onClose={this.onClose}
        visible={true}
      >
        {_.isFunction(children) ? children(this.showChildrenDrawer) : children}
        {childs.map(item => {
          const propsChild = {
            width: "40%",
            title: "title",
            entry: "",
            ...item
          };
          return (
            <Drawer
              key={propsChild.title}
              title={propsChild.title}
              width={propsChild.width}
              closable={true}
              onClose={this.onChildrenDrawerClose}
              visible={this.state.childrenDrawer === propsChild.title}
            >
              {_.isFunction(propsChild.children)
                ? propsChild.children(this.state.childrenDrawerData)
                : propsChild.children}
            </Drawer>
          );
        })}
      </Drawer>
    );
  }
}

export default MyDrawer;
