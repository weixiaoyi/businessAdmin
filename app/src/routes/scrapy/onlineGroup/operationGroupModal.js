import React, { Component } from "react";
import { Button, Modal, Form, Input } from "antd";
import { Inject } from "../../../utils";

@Form.create({})
@Inject(({ onlineStore: model, globalStore }) => ({
  model,
  globalStore
}))
class OperationGroupModal extends Component {
  componentDidMount() {}

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {
          model: { dispatch },
          globalStore: {
            modal: {
              data: { action, ...record }
            }
          }
        } = this.props;
        if (action === "add") {
          dispatch({
            type: "operationGroup",
            payload: {
              action,
              ...values
            }
          });
        } else if (action === "edit") {
          dispatch({
            type: "operationGroup",
            payload: {
              action,
              ...values,
              id: record._id
            }
          });
        }
      }
    });
  };

  render() {
    const {
      model: { closeModal, loading },
      globalStore: {
        modal: {
          data: { action, ...record }
        }
      }
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    return (
      <Modal
        confirmLoading={loading.operationGroup}
        title={action === "add" ? "添加圈子" : "修改圈子"}
        visible={true}
        onOk={this.handleSubmit}
        onCancel={closeModal}
      >
        <Form {...formItemLayout}>
          <Form.Item label="排序索引">
            {getFieldDecorator("index", {
              rules: [
                {
                  required: true,
                  message: "必填,整数类型"
                }
              ],
              initialValue: record.index
            })(<Input />)}
          </Form.Item>
          <Form.Item label="分类">
            {getFieldDecorator("type", {
              rules: [
                {
                  required: true,
                  message: "必填"
                }
              ],
              initialValue: record.type
            })(<Input />)}
          </Form.Item>
          <Form.Item label="标题">
            {getFieldDecorator("title", {
              rules: [
                {
                  required: true,
                  message: "必填"
                }
              ],
              initialValue: record.title
            })(<Input />)}
          </Form.Item>
          <Form.Item label="描述">
            {getFieldDecorator("desc", {
              rules: [
                {
                  required: true,
                  message: "必填"
                }
              ],
              initialValue: record.desc
            })(<Input />)}
          </Form.Item>
          <Form.Item label="图片地址">
            {getFieldDecorator("avatar", {
              rules: [
                {
                  required: true,
                  message: "必填"
                }
              ],
              initialValue: record.avatar
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default OperationGroupModal;
