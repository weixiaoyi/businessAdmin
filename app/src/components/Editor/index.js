import React, { Component } from "react";
import E from "wangeditor";

class Editor extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const elem = this.refs.editorElem;
    const editor = new E(elem);
    editor.customConfig.onchange = html => {
      this.setState({
        editorContent: html
      });
    };
    editor.create();
    this.editor = editor;
  }

  componentDidUpdate(prevProps) {
    const { content: contentPrev } = prevProps;
    const { content } = this.props;
    if (content !== contentPrev) {
      this.editor.txt.html(content);
    }
  }

  render() {
    return (
      <div>
        <div ref="editorElem" style={{ textAlign: "left" }} />
        {this.props.children(this.editor)}
      </div>
    );
  }
}

export default Editor;
