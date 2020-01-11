import React, { Component } from "react";
import { Form, Input, Button } from "antd";
import _ from "lodash";
import * as styles from "./index.module.scss";

@Form.create({})
class MyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: _.uniqueId("form_")
    };
  }

  componentDidMount() {}

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
      case "input": {
        FormComponent = <Input {...props} />;
      }
    }
    return FormComponent;
  };

  render() {
    const { id } = this.state;
    const { className, configs = {} } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        {configs.components.map(item => (
          <Form.Item key={item.field} label={item.label}>
            {getFieldDecorator(item.field, {
              rules: item.rules
            })(this.renderComponent(item))}
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
