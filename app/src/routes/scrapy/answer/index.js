import React, { Component } from "react";
import { Button, Card, Divider, Select, Input, Popover } from "antd";
import classNames from "classnames";
import _ from "lodash";
import { Inject } from "../../../utils";
import Preview from "./preview";
import AnswerTable from "./answerTable";
import AnswerEditor from "./answerEditor";
import * as styles from "./index.module.scss";

@Inject(({ scrapyStore: model }) => ({
  model
}))
class Answer extends Component {
  state = {
    editable: null,
    selectOne: {},
    selectAnswerIds: [],
    searchUrl: undefined
  };

  componentDidMount() {
    this.getAnswers();
    this.webview = document.querySelector("webview");
    window.ipc &&
      window.ipc.on("scrapy.download-image", (e, arg) => {
        if (!arg) return;
        const imageUpdate = document.getElementsByClassName("image-update");
        Array.prototype.map.call(imageUpdate, one => {
          const images = one.getElementsByTagName("img");
          Array.prototype.map.call(images, item => {
            const src = item.getAttribute("src").replace(/(.*)\?time=.*/, "$1");
            item.setAttribute("src", `${src}?time=${Date.now()}`);
          });
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
      this.switchAnswer({
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
    this.webview && this.webview.stop();
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

  changeEditable = status => {
    this.setState({
      editable: status
    });
  };

  render() {
    const { selectOne, selectAnswerIds, searchUrl, editable } = this.state;
    const {
      model: { dispatch, answers = [], pagination, dbName, appPath }
    } = this.props;
    const newSelectOne = {
      ...selectOne,
      content:
        selectOne && selectOne.content && window.ipc
          ? selectOne.content.replace(
              /src="http:\/\/(.*?)\.jpg"/g,
              window.path.join(
                "src=file://",
                appPath.imagesPath,
                dbName,
                `${"$1"}.jpg?filename=${"$1"}.jpg`
              )
            )
          : ""
    };
    return (
      <div className={classNames(styles.Answer, "page")}>
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
                      url:
                        searchUrl && searchUrl.length ? searchUrl[0] : undefined
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
              selectOne={newSelectOne}
              getAnswers={this.getAnswers}
              switchAnswer={this.switchAnswer}
              updateAnswer={this.updateAnswer}
              setSelectRows={this.setSelectRows}
            />

            <webview
              allowpopups={"true"}
              className={styles.webview}
              src={
                newSelectOne.questionId
                  ? `https://www.zhihu.com/question/${newSelectOne.questionId}/answer/${newSelectOne.answerId}`
                  : "https://www.zhihu.com/"
              }
            />
          </div>
        </div>
        <div className={styles.editor} id="answer-operation">
          <AnswerEditor
            selectOne={newSelectOne}
            editable={editable}
            changeEditable={this.changeEditable}
            updateAnswer={this.updateAnswer}
          />
          {newSelectOne.content && (
            <div className={styles.preview}>
              <Preview
                content={newSelectOne.content}
                authorName={newSelectOne.authorName}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Answer;
