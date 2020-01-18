import React, { Component } from "react";
import { Form, Input, Select, Button } from "antd";
import _ from "lodash";
import * as styles from "./index.module.scss";

const { Option } = Select;

@Form.create({})
class MyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: _.uniqueId("form_")
    };
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.props.reset && this.props.reset();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submit && this.props.submit(values);
      }
    });
  };

  renderComponent = (item, props) => {
    let FormComponent;
    switch (item.type) {
      case "select":
        {
          FormComponent = (
            <Select {...props}>
              {item.options.map(one => (
                <Option key={one.value} value={one.value}>
                  {one.text}
                </Option>
              ))}
            </Select>
          );
        }
        break;
      case "input": {
        FormComponent = <Input {...props} />;
      }
    }
    return FormComponent;
  };

  render() {
    const { id } = this.state;
    const { className, configs = {}, layout } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout={layout} onSubmit={this.handleSubmit} className="login-form">
        {configs.components.map(item => (
          <Form.Item key={item.field} label={item.label}>
            {getFieldDecorator(item.field, {
              rules: item.rules
            })(
              this.renderComponent(item, {
                placeholder: item.placeholder
              })
            )}
          </Form.Item>
        ))}
        <Form.Item key="submit">
          <Button type="primary" htmlType="submit">
            确认
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default MyForm;
