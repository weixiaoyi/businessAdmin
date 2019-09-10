import React, { Component } from "react";
import { Button, Tooltip, Select, Input, Popover, Form } from "antd";
import classNames from "classnames";
import { Inject } from "../../utils";
import * as styles from "./preview.module.scss";
import { Clipboard, Editor } from "../../components";

@Form.create()
@Inject(({ scrapyStore: model }) => ({
  model
}))
class Preview extends Component {
  state = {
    links: [],
    showUserDownload: false
  };

  componentDidMount() {
    this.parseLinks();
  }

  componentDidUpdate(prevProps) {
    const { content: contentPrev } = prevProps;
    const { content } = this.props;
    if (content && contentPrev !== content) {
      this.parseLinks();
      this.resetFields();
    }
  }

  parseLinks = () => {
    const images = document
      .getElementById("answer-preview")
      .querySelectorAll("img");

    const links =
      images.length > 0
        ? Array.prototype.map.call(images, item => {
            const srcDefault =
              item.getAttribute("data-default-watermark-src") ||
              item.getAttribute("data-actualsrc") ||
              item.getAttribute("data-original");
            const srcLocal = item.getAttribute("src");
            const filename = srcLocal.replace(/.*\/(.*)\.jpg/g, "$1");
            return {
              srcDefault,
              srcLocal,
              filename
            };
          })
        : [];
    if (links && links.length) {
      this.setState({
        links
      });
    } else if (this.state.links.length) {
      this.setState({
        links: []
      });
    }
  };

  downloadImage = async (url, filename) => {
    const {
      model: { dispatch }
    } = this.props;
    const dataUrl =
      window.imageEditor && (await window.imageEditor.exportImageFromUrl(url));
    if (dataUrl && dataUrl.length) {
      dispatch({
        type: "ipc-download-image",
        payload: {
          dataUrl,
          filename
        }
      });
    }
  };

  resetFields = () => {
    this.props.form.resetFields();
    this.dataUrlEditor && this.dataUrlEditor.txt.html("");
  };

  render() {
    const { links, showUserDownload } = this.state;
    const {
      content,
      model: { dispatch }
    } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <div className={classNames(styles.preview)}>
        <div className={styles.utils}>
          <Popover
            visible={showUserDownload}
            getPopupContainer={() => document.getElementById("user_download")}
            content={
              <div style={{ width: 400 }}>
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                    this.props.form.validateFields((err, values) => {
                      if (!err) {
                        const { filename } = values;
                        const html = this.dataUrlEditor.txt.html();
                        const div = document.createElement("div");
                        div.innerHTML = html;
                        const img = div.getElementsByTagName("img")[0];
                        if (img) {
                          const src = img.getAttribute("src");
                          dispatch({
                            type: "ipc-download-image",
                            payload: {
                              dataUrl: src,
                              filename
                            }
                          });
                        }
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
                      rules: [
                        { required: true, message: "required" },
                        {
                          validator: (rule, value, callback) => {
                            if (links.find(item => item.filename === value)) {
                              return callback();
                            } else {
                              return callback("未在当前图片列表找到对应的图片");
                            }
                          }
                        }
                      ]
                    })(<Input placeholder="filename" />)}
                  </Form.Item>
                  <Form.Item label="dataUrl">
                    {getFieldDecorator("dataUrl")(
                      <Editor
                        className={styles.dataUrl}
                        getEditor={editor => (this.dataUrlEditor = editor)}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    className={styles.nolabel}
                    label={<span style={{ after: "unset" }}>&nbsp;</span>}
                  >
                    <div className={styles.operationButton}>
                      <Button type="primary" htmlType="submit">
                        确认
                      </Button>
                      <Button type="danger" onClick={this.resetFields}>
                        重置
                      </Button>
                    </div>
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
        <div className="image-update">
          {links.length > 0 && (
            <div className={styles.images}>
              <ul id="imageList-preview">
                {links.map((item, index) => (
                  <li
                    key={index}
                    className={
                      getFieldValue("filename") === item.filename
                        ? styles.active
                        : null
                    }
                  >
                    <div className={styles.imageContainer}>
                      <Tooltip title={item.srcDefault} placement="bottom">
                        <img
                          src={item.srcLocal}
                          onClick={() =>
                            this.downloadImage(item.srcDefault, item.filename)
                          }
                        />
                      </Tooltip>
                    </div>

                    <Clipboard
                      className={styles.clipboard}
                      text={item.filename}
                      width={40}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.previewContainer}>
            <div
              className={styles.answerPreview}
              id="answer-preview"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Preview;
