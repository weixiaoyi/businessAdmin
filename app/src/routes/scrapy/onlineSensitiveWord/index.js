import React, { Component } from "react";
import {
  Button,
  Table,
  Form,
  Input,
  Icon,
  Select,
  DatePicker,
  Tag,
  Popconfirm
} from "antd";
import classNames from "classnames";
import { Inject } from "../../../utils";
import OperationSensitiveModal from "./operationSensitiveModal";
import * as styles from "./index.module.scss";

@Form.create({})
@Inject(({ onlineStore: model, globalStore }) => ({
  model,
  globalStore
}))
class OnlineSensitiveWord extends Component {
  componentDidMount() {
    this.getSensitiveWord();
  }

  getSensitiveWord = () => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "getSensitiveWord"
    });
  };

  delete = id => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "operationSensitiveWord",
      payload: {
        action: "delete",
        id
      }
    });
  };

  render() {
    const {
      globalStore: {
        modal: { name }
      },
      model: { loading, openModal, sensitiveWords }
    } = this.props;
    return (
      <div className={classNames(styles.OnlineSensitiveWord, "page")}>
        <div>
          <Button
            loading={loading.operationSensitiveWord}
            type="primary"
            onClick={() => {
              openModal({
                name: "OperationSensitiveModal",
                data: {
                  action: "add"
                }
              });
            }}
          >
            添加敏感词
          </Button>
          <ul className={styles.wordList}>
            {sensitiveWords.map(item => (
              <li key={item._id}>
                <Tag>
                  {item.word}
                  <Icon
                    type="edit"
                    style={{ marginLeft: 10, marginRight: 10 }}
                    onClick={() =>
                      openModal({
                        name: "OperationSensitiveModal",
                        data: {
                          ...item,
                          action: "update"
                        }
                      })
                    }
                  />
                  <Popconfirm
                    title={"确认删除吗"}
                    onConfirm={() => this.delete(item._id)}
                  >
                    <Icon
                      type="delete"
                      style={{ marginLeft: 10, marginRight: 10 }}
                    />
                  </Popconfirm>
                </Tag>
              </li>
            ))}
          </ul>
          {name === "OperationSensitiveModal" && <OperationSensitiveModal />}
        </div>
      </div>
    );
  }
}

export default OnlineSensitiveWord;
