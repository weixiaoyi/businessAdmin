import React, { Component } from "react";
import { Button, Card, Divider, Select, Input, Popover, Form } from "antd";
import { Editor } from "../../components";
import { Inject, formatTime } from "../../utils";
import * as styles from "./answerEditor.module.scss";

const { TextArea } = Input;

@Form.create()
@Inject(({ scrapyStore: model }) => ({
  model
}))
class AnswerEditor extends Component {
  state = {
    showUserDownload: false
  };

  componentDidMount() {
    window.ipc &&
      window.ipc.on("scrapy.download-image", (e, arg) => {
        if (!arg) return;
        const images = document
          .getElementById("answer-operation")
          .querySelectorAll("img");
        Array.prototype.map.call(images, item => {
          const src = item.getAttribute("src");
          item.setAttribute("src", `${src}?time=${Date.now()}`);
        });
      });
  }

  render() {
    const { showUserDownload } = this.state;
    const { selectOne, editable, changeEditable, updateAnswer } = this.props;

    const { getFieldDecorator } = this.props.form;

    return (
      <div className={styles.answerEditor}>
        {selectOne.title && (
          <div className={styles.contentHeader}>
            <span className={styles.title}>{selectOne.title}</span>
            <div className={styles.info}>
              {selectOne.createTime && (
                <span className={styles.createTime}>
                  {formatTime(selectOne.createTime)}
                </span>
              )}
              <span className={styles.author}>({selectOne.authorName})</span>
            </div>
          </div>
        )}

        <Editor
          className={styles.editorContent}
          content={selectOne.content}
          editable={editable}
        >
          {editor => (
            <div className={styles.utils}>
              <div>
                <Button
                  disabled={!editable}
                  type="primary"
                  onClick={() => {
                    updateAnswer({
                      answerId: selectOne.answerId,
                      content: editor.txt.html()
                    });
                  }}
                >
                  保存
                </Button>
                <Divider type="vertical" />
                <Button
                  disabled={editable}
                  type="primary"
                  onClick={() => {
                    changeEditable(true);
                  }}
                >
                  编辑
                </Button>
              </div>
              <div>
                <Popover
                  visible={showUserDownload}
                  getPopupContainer={() =>
                    document.getElementById("user_download")
                  }
                  content={
                    <div style={{ width: 400 }}>
                      <Form
                        onSubmit={e => {
                          e.preventDefault();
                          this.props.form.validateFields((err, values) => {
                            if (!err) {
                              const { filename, dataUrl } = values;
                              console.log(values);
                              // dispatch({
                              //   type: "ipc-download-image",
                              //   payload: {
                              //     dataUrl,
                              //     filename
                              //   }
                              // });
                            }
                          });
                        }}
                        className="login-form"
                        {...{
                          labelCol: {
                            sm: { span: 5 }
                          },
                          wrapperCol: {
                            sm: { span: 19 }
                          }
                        }}
                      >
                        <Form.Item label="filename">
                          {getFieldDecorator("filename", {
                            rules: [{ required: true, message: "required" }]
                          })(<Input placeholder="filename" />)}
                        </Form.Item>
                        <Form.Item label="dataUrl">
                          {getFieldDecorator("dataUrl", {
                            rules: [{ required: true, message: "required" }]
                          })(<TextArea placeholder="dataUrl" />)}
                        </Form.Item>
                        <Form.Item
                          className={styles.nolabel}
                          label={<span style={{ after: "unset" }}>&nbsp;</span>}
                        >
                          <Button type="primary" htmlType="submit">
                            确认
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  }
                  title="手动添加图片"
                  trigger="click"
                >
                  <Button
                    id="user_download"
                    onClick={() => {
                      this.setState({
                        showUserDownload: !showUserDownload
                      });
                    }}
                  >
                    手动下载图片
                  </Button>
                </Popover>
              </div>
            </div>
          )}
        </Editor>
      </div>
    );
  }
}

export default AnswerEditor;
