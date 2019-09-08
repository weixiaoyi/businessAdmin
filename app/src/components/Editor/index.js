import React, { Component } from "react";
import E from "wangeditor";
import _ from "lodash";

class Editor extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      id: _.uniqueId("editor_")
    };
  }

  componentDidMount() {
    const { id } = this.state;
    const elem = document.getElementById(id);
    const editor = new E(elem);
    editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.onchange = html => {
      this.setState({
        editorContent: html
      });
    };
    editor.create();
    this.editor = editor;
  }

  componentDidUpdate(prevProps) {
    const { content: contentPrev, editable: editablePrev } = prevProps;
    const { content, editable } = this.props;
    if (content !== contentPrev) {
      this.editor.txt.html(content);
    }
    if (!_.isUndefined(editable) && editable !== editablePrev) {
      this.editor && this.editor.$textElem.attr("contenteditable", editable);
    }
  }

  render() {
    const { id } = this.state;
    const { className } = this.props;
    return (
      <div className={className}>
        <div id={id} style={{ textAlign: "left" }} />
        {this.props.children(this.editor)}
      </div>
    );
  }
}

export default Editor;
