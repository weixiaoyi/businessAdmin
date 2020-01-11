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
      childrenDrawer: false
    };
  }

  componentDidMount() {}

  onClose = () => {
    this.props.model.closeModal();
  };

  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true
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
      child = {},
      model: {
        modal: { name }
      }
    } = this.props;
    const propsChild = {
      width: "40%",
      title: "title",
      entry: "",
      ...child
    };
    return (
      name === "drawer" && (
        <Drawer
          className={className}
          id={id}
          title={
            <div className={styles.header}>
              {title}
              {propsChild.entry && (
                <Button type="primary" onClick={this.showChildrenDrawer}>
                  {propsChild.entry}
                </Button>
              )}
            </div>
          }
          width={width}
          closable={true}
          onClose={this.onClose}
          visible={true}
        >
          {children}
          <Drawer
            title={propsChild.title}
            width={propsChild.width}
            closable={true}
            onClose={this.onChildrenDrawerClose}
            visible={this.state.childrenDrawer}
          >
            {propsChild.children}
          </Drawer>
        </Drawer>
      )
    );
  }
}

export default MyDrawer;
