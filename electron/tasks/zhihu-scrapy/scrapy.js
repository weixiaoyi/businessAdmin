const formatStyle = window.preloadUtils.formatStyle;
const buttonStyle = {
  background: "red",
  margin: "10px",
  padding: "10px",
  color: "white"
};

const detailStyle = {
  background: "green",
  padding: "5px",
  color: "white"
};

window.ipc.on("createUtils", () => {
  const div = document.createElement("div");
  const content = `
<div style=${formatStyle({
    position: "fixed",
    top: "0",
    background: "rgba(0,0,0,.6)",
    "z-index": "10000"
  })}>
<button style=${formatStyle(buttonStyle)}  id="start" >开始滚动</button>
<button id="end" style=${formatStyle(buttonStyle)}>结束滚动</button>
<button id="seeUrl" style=${formatStyle(buttonStyle)}>查看url</button>
<button id="seeAnswers" style=${formatStyle(buttonStyle)}>查看答案列表</button>
<div>
<div id="totalAnswers" style=${formatStyle(detailStyle)}></div>
<div id="haveGetAnswers" style=${formatStyle(detailStyle)}></div>
</div>
</div>
`;
  div.innerHTML = `${content}`;
  document.body.appendChild(div);
  document.getElementById("start").onclick = () => {
    const ansers = document.getElementsByClassName("List-headerText")[0]
      .innerHTML;
    const total = document.getElementById("totalAnswers");
    const haveGet = document.getElementById("haveGetAnswers");
    total.innerHTML = `总共：${ansers}`;
    clearInterval(window.interval);
    window.interval = setInterval(() => {
      const t = document.body.clientHeight;
      window.scrollTo({ top: t, left: 0, behavior: "smooth" });
      const len = document
        .getElementsByClassName("Card AnswersNavWrapper")[0]
        .getElementsByClassName("List-item").length;
      haveGet.innerHTML = `已经获取${len}个答案`;
    }, 3000);
  };
  document.getElementById("end").onclick = () => {
    clearInterval(window.interval);
  };
  document.getElementById("seeUrl").onclick = () => {
    alert(document.location.href);
  };
  document.getElementById("seeAnswers").onclick = () => {
    const len = document.getElementsByClassName("List-item").length;
    alert(len);
  };
});
