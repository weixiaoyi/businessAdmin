import React, { Component } from "react";
import { Button, Card, Divider } from "antd";
import classNames from "classnames";
import { Editor } from "../../../components";
import { Inject, formatTime } from "../../../utils";
import * as styles from "./answerEditor.module.scss";

@Inject(({ scrapyStore: model }) => ({
  model
}))
class AnswerEditor extends Component {
  componentDidMount() {
    window.ipc &&
      window.ipc.on("scrapy.download-image", (e, arg) => {
        if (!arg) return;
        const imageUpdate = document.getElementsByClassName("image-update");
        Array.prototype.map.call(imageUpdate, one => {
          const images = one.getElementsByTagName("img");
          Array.prototype.map.call(images, item => {
            const src = item.getAttribute("src");
            item.setAttribute("src", `${src}?time=${Date.now()}`);
          });
        });
      });
  }

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
                    content: this.editor.txt.html()
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
