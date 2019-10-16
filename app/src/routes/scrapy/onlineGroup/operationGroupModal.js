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
              data: { action }
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
        }
      }
    });
  };

  render() {
    const {
      model: { closeModal, loading },
      globalStore: {
        modal: {
          data: { action }
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
        title={action === "add" ? "添加圈子" : ""}
        visible={true}
        onOk={this.handleSubmit}
        onCancel={closeModal}
      >
        <Form {...formItemLayout}>
          <Form.Item label="分类">
            {getFieldDecorator("type", {
              rules: [
                {
                  required: true,
                  message: "必填"
                }
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="标题">
            {getFieldDecorator("title", {
              rules: [
                {
                  required: true,
                  message: "必填"
                }
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="描述">
            {getFieldDecorator("desc", {
              rules: [
                {
                  required: true,
                  message: "必填"
                }
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="图片地址">
            {getFieldDecorator("avatar", {
              rules: [
                {
                  required: true,
                  message: "必填"
                }
              ]
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default OperationGroupModal;
