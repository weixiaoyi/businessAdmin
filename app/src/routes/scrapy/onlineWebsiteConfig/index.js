import React, { Component } from "react";
import { Button, Table, Form, Input } from "antd";
import classNames from "classnames";
import _ from "lodash";
import { Inject } from "../../../utils";
import { Domain } from "../../../constants";
import * as styles from "./index.module.scss";

@Form.create({})
@Inject(({ onlineStore: model }) => ({
  model
}))
class OnlineWebsite extends Component {
  componentDidMount() {
    this.getWebsiteConfig();
  }

  getWebsiteConfig = () => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "getWebsiteConfig"
    }).then(res => {
      if (res) {
        this.props.form.setFieldsValue({
          domain: res.domain,
          siteMemberPrice: _.get(res, "detail.siteMemberPrice")
        });
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {
          model: { dispatch }
        } = this.props;
        const { domain, ...rest } = values;
        dispatch({
          type: "operationWebsiteConfig",
          payload: {
            domain,
            detail: {
              ...rest
            }
          }
        });
      }
    });
  };
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 6
        }
      }
    };
    const { getFieldDecorator } = this.props.form;
    const {
      model: { loading }
    } = this.props;
    return (
      <div className={classNames(styles.OnlineWebsite, "page")}>
        <div>
          <Form
            {...formItemLayout}
            onSubmit={this.handleSubmit}
            style={{ width: 600 }}
          >
            <Form.Item label="domain">
              {getFieldDecorator("domain", {
                initialValue: Domain.fuye.value,
                rules: [
                  {
                    required: true,
                    message: "必填"
                  }
                ]
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item label="一站通会员价">
              {getFieldDecorator("siteMemberPrice", {
                rules: [
                  {
                    required: true,
                    message: "当前网站必填一站通会员价"
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
                loading={
                  loading.getWebsiteConfig || loading.operationWebsiteConfig
                }
              >
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default OnlineWebsite;
