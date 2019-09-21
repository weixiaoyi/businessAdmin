import React, { Component } from "react";
import { Button, Card, Divider } from "antd";
import classNames from "classnames";
import { Editor } from "../../../components";
import { formatTime, observer } from "../../../utils";
import * as styles from "./answerEditor.module.scss";

@observer
class AnswerEditor extends Component {
  render() {
    const { selectOne, editable, changeEditable, updateAnswer } = this.props;

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

        {selectOne.title && (
          <div className={styles.utils}>
            <div>
              <Button
                disabled={!editable}
                type="primary"
                onClick={() => {
                  updateAnswer({
                    answerId: selectOne.answerId,
                    content: this.editor.txt.html(),
                    update: true
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
          </div>
        )}

        <Editor
          className={classNames(styles.editorContent, "image-update")}
          content={selectOne.content}
          editable={editable}
          getEditor={editor => (this.editor = editor)}
        />
      </div>
    );
  }
}

export default AnswerEditor;
