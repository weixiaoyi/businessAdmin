import React, { Component } from "react";
import { Button, Table, Form, Input, Icon, Select, DatePicker } from "antd";
import classNames from "classnames";
import _ from "lodash";
import moment from "moment";
import { Inject } from "../../../utils";
import { Domain } from "../../../constants";
import * as styles from "./index.module.scss";

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

@Form.create({})
@Inject(({ onlineStore: model }) => ({
  model
}))
class OnlineWebsite extends Component {
  state = {
    ids: []
  };
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
        const notifies = _.get(res, "detail.notifies");
        const noticeTitles = notifies.reduce((sum, next, index) => {
          sum[`noticeTitles[${index}]`] = next.title;
          return sum;
        }, {});
        const noticeContents = notifies.reduce((sum, next, index) => {
          sum[`noticeContents[${index}]`] = next.content;
          return sum;
        }, {});
        const noticeTypes = notifies.reduce((sum, next, index) => {
          sum[`noticeTypes[${index}]`] = next.type;
          return sum;
        }, {});
        const noticeDates = notifies.reduce((sum, next, index) => {
          sum[`noticeDates[${index}]`] = next.date.map(item => moment(item));
          return sum;
        }, {});

        this.setState(
          {
            ids: new Array(notifies.length).fill().map((item, index) => index)
          },
          () => {
            this.props.form.setFieldsValue({
              domain: res.domain,
              siteMemberPrice: _.get(res, "detail.siteMemberPrice"),
              ...noticeTitles,
              ...noticeContents,
              ...noticeTypes,
              ...noticeDates
            });
          }
        );
      }
    });
  };

  remove = k => {
    this.setState({
      ids: this.state.ids.filter(key => key !== k)
    });
  };

  add = () => {
    this.setState({
      ids: this.state.ids.concat([this.state.ids.length])
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {
          model: { dispatch }
        } = this.props;
        const { domain, siteMemberPrice } = values;
        dispatch({
          type: "operationWebsiteConfig",
          payload: {
            domain,
            detail: {
              siteMemberPrice,
              notifies: this.state.ids.map(item => ({
                title: values.noticeTitles[item],
                content: values.noticeContents[item],
                date: values.noticeDates[item],
                type: values.noticeTypes[item]
              }))
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
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 24,
          offset: 2
        }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 22, offset: 2 }
      }
    };
    const { getFieldDecorator } = this.props.form;
    getFieldDecorator("noticeContents", { initialValue: [] });
    getFieldDecorator("noticeTypes", { initialValue: [] });
    const keys = this.state.ids;
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? "通知" : ""}
        required={false}
        key={k}
      >
        {getFieldDecorator(`noticeTitles[${k}]`, {
          validateTrigger: ["onChange", "onBlur"],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "请输入标题"
            }
          ]
        })(<TextArea placeholder="标题" style={{ width: "20%" }} />)}
        {getFieldDecorator(`noticeContents[${k}]`, {
          validateTrigger: ["onChange", "onBlur"],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "请输入通知内容"
            }
          ]
        })(<TextArea placeholder="内容" style={{ width: "30%" }} />)}
        {getFieldDecorator(`noticeTypes[${k}]`, {
          validateTrigger: ["onChange", "onBlur"],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "请选择类型"
            }
          ]
        })(
          <Select placeholder="通知类型" style={{ width: "10%" }}>
            <Option value="message">message</Option>
            <Option value="modal">modal</Option>
          </Select>
        )}
        {getFieldDecorator(`noticeDates[${k}]`, {
          validateTrigger: ["onChange"],
          rules: [
            {
              type: "array",
              required: true,
              message: "请选择日期范围"
            }
          ]
        })(<RangePicker showTime format="YYYY/MM/DD HH:mm:ss" />)}
        <Icon
          style={{ width: 30 }}
          className="dynamic-delete-button"
          type="minus-circle-o"
          onClick={() => this.remove(k)}
        />
      </Form.Item>
    ));

    const {
      model: { loading }
    } = this.props;

    return (
      <div className={classNames(styles.OnlineWebsite, "page")}>
        <div>
          <Form
            {...formItemLayout}
            onSubmit={this.handleSubmit}
            // style={{ width: "70%" }}
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
            {formItems}
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add}>
                <Icon type="plus" /> 添加
              </Button>
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
