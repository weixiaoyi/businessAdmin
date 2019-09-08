import React, { Component } from "react";
import { Button, Card, Divider, Select, Input, Popover, Form } from "antd";
import classNames from "classnames";
import _ from "lodash";
import { Editor } from "../../components";
import { Inject, formatTime } from "../../utils";
import Preview from "./preview";
import AnswerTable from "./answerTable";
import * as styles from "./index.module.scss";

const { TextArea } = Input;

@Form.create()
@Inject(({ scrapyStore: model }) => ({
  model
}))
class Scrapy extends Component {
  state = {
    selectOne: {},
    editable: null,
    selectAnswerIds: [],
    searchUrl: undefined,
    showUserDownload: false
  };

  componentDidMount() {
    this.getAnswers();
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

  componentDidUpdate() {
    const { selectOne, selectAnswerIds } = this.state;
    const {
      model: { answers }
    } = this.props;
    const findOne = answers.find(item => item.answerId === selectOne.answerId);
    if (findOne && !_.isEqual(findOne, selectOne)) {
      this.setState({
        selectOne: findOne
      });
    }
    if (
      selectAnswerIds.length > 0 &&
      !selectAnswerIds.some(item => answers.find(one => one.answerId === item))
    ) {
      this.setState({
        selectAnswerIds: []
      });
    }
  }

  getAnswers = ({ current, pageSize } = {}) => {
    const {
      model: { dispatch }
    } = this.props;

    dispatch({
      type: "ipc-get-scrapy-answers",
      payload: {
        current,
        pageSize
      }
    });
  };

  updateAnswer = ({ answerId, ...rest }) => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "ipc-update-answer",
      payload: {
        answerId,
        ...rest
      }
    });
  };

  switchAnswer = ({ selectOne, editable }) => {
    this.setState({
      selectOne,
      editable
    });
  };

  massDelete = () => {
    const {
      model: { dispatch }
    } = this.props;
    const { selectAnswerIds } = this.state;
    dispatch({
      type: "ipc-mass-delete-answer",
      payload: {
        answerIds: selectAnswerIds
      }
    });
  };

  setSelectRows = answerIds => {
    this.setState({
      selectAnswerIds: answerIds
    });
  };

  render() {
    const {
      selectOne,
      editable,
      selectAnswerIds,
      searchUrl,
      showUserDownload
    } = this.state;
    const {
      model: { dispatch, answers = [], pagination }
    } = this.props;

    const { getFieldDecorator } = this.props.form;

    return (
      <div className={classNames(styles.Scrapy, "page")}>
        <div className={styles.list}>
          <div className={styles.utils}>
            <div>
              <Select
                value={searchUrl}
                mode="tags"
                showSearch
                style={{ width: 150 }}
                onChange={value => {
                  this.setState({
                    searchUrl: value
                  });
                }}
              />
              <Button
                type="primary"
                onClick={() => {
                  dispatch({
                    type: "ipc-create-scrapy",
                    payload: {
                      url: searchUrl && searchUrl.length ? [0] : undefined
                    }
                  });
                }}
              >
                创建爬虫
              </Button>
              <Button type="dashed" icon="reload" onClick={this.getAnswers}>
                刷新数据
              </Button>
            </div>
            <div>
              <Button
                disabled={!selectAnswerIds.length}
                type="danger"
                onClick={this.massDelete}
              >
                批量删除
              </Button>
            </div>
          </div>
          <div className={styles.leftContent}>
            <AnswerTable
              dispatch={dispatch}
              answers={answers}
              pagination={pagination}
              selectOne={selectOne}
              getAnswers={this.getAnswers}
              switchAnswer={this.switchAnswer}
              updateAnswer={this.updateAnswer}
              setSelectRows={this.setSelectRows}
            />

            <webview
              className={styles.webview}
              src={
                selectOne.questionId
                  ? `https://www.zhihu.com/question/${selectOne.questionId}/answer/${selectOne.answerId}`
                  : "https://www.zhihu.com/"
              }
            />
          </div>
        </div>
        <div className={styles.editor} id="answer-operation">
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
                      this.updateAnswer({
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
                      this.setState({
                        editable: true
                      });
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
                            label={
                              <span style={{ after: "unset" }}>&nbsp;</span>
                            }
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
          {selectOne.content && (
            <div className={styles.preview}>
              <Preview content={selectOne.content} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Scrapy;
