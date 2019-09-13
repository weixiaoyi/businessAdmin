import React, { Component } from "react";
import { Button, Card, Divider, Select, Input, Popover, Form } from "antd";
import classNames from "classnames";
import _ from "lodash";
import { Inject } from "../../../utils";
import Preview from "./preview";
import AnswerTable from "./answerTable";
import AnswerEditor from "./answerEditor";
import * as styles from "./index.module.scss";

@Form.create()
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
    const webview = document.querySelector("webview");
    webview.addEventListener("did-finish-load", () => {});
  }
  componentWillUnmount() {}

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

  changeEditable = status => {
    this.setState({
      editable: status
    });
  };

  render() {
    const { selectOne, selectAnswerIds, searchUrl, editable } = this.state;
    const {
      model: { dispatch, answers = [], pagination }
    } = this.props;

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
              allowpopups={"true"}
              webpreferences="allowRunningInsecureContent, javascript=no"
              enableblinkfeatures="PreciseMemoryInfo, CSSVariables"
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
          <AnswerEditor
            selectOne={selectOne}
            editable={editable}
            changeEditable={this.changeEditable}
            updateAnswer={this.updateAnswer}
          />
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

export default Answer;
