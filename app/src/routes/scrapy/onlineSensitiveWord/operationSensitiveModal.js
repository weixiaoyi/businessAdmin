import React, { Component } from "react";
import { Button, Modal, Form, Input } from "antd";
import { Inject } from "../../../utils";

@Form.create({})
@Inject(({ onlineStore: model, globalStore }) => ({
  model,
  globalStore
}))
class OperationSensitiveModal extends Component {
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
        console.log(action);
        if (action === "add") {
          dispatch({
            type: "operationSensitiveWord",
            payload: {
              action,
              ...values
            }
          });
        } else if (action === "update") {
          dispatch({
            type: "operationSensitiveWord",
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
        confirmLoading={loading.operationSensitiveWord}
        title={action === "add" ? "添加敏感词" : "修改敏感词"}
        visible={true}
        onOk={this.handleSubmit}
        onCancel={closeModal}
      >
        <Form {...formItemLayout}>
          <Form.Item label="敏感词">
            {getFieldDecorator("word", {
              rules: [
                {
                  required: true,
                  message: "必填"
                }
              ],
              initialValue: record.word
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default OperationSensitiveModal;
