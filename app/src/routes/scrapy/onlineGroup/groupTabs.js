import React, { Component } from "react";
import { Button, Tabs, Divider, Popconfirm } from "antd";
import _ from "lodash";
import { Inject } from "../../../utils";
import * as styles from "./groupTabs.module.scss";

const { TabPane } = Tabs;

@Inject(({ onlineStore: model }) => ({
  model
}))
class GroupTabs extends Component {
  componentDidMount() {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "getGroups"
    });
  }

  render() {
    const {
      model: { openModal, groups = [] }
    } = this.props;

    const sorts = groups.reduce((sum, next) => {
      if (!sum[next.type]) {
        sum[next.type] = [];
      }
      sum[next.type].push(next);
      return sum;
    }, {});

    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <Button
            type="primary"
            onClick={() => {
              openModal({
                name: "OperationGroupModal",
                data: {
                  action: "add"
                }
              });
            }}
          >
            添加
          </Button>
        </div>
        <Tabs defaultActiveKey="1" tabPosition="top" className={styles.tabs}>
          {_.keys(sorts).map(item => (
            <TabPane tab={`${item}(${sorts[item].length})`} key={item}>
              <ul className={styles.groups}>
                {sorts[item].map((one = {}) => (
                  <li key={one._id}>
                    <div className={styles.left}>left</div>
                    <div className={styles.right}>
                      <div>{one.title}</div>
                      <div>{one.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default GroupTabs;
