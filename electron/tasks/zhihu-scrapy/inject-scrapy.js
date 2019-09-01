const formatStyle = window.preloadUtils.formatStyle;

const buttonStyle = {
  background: "red",
  margin: "10px",
  padding: "10px",
  color: "white"
};

const detailStyle = {
  background: "blue",
  padding: "5px",
  color: "white"
};

window.ipc.on("createUtils", () => {
  const div = document.createElement("div");
  const content = `
<div id="electron-utils" style=${formatStyle({
    position: "fixed",
    top: "0",
    background: "rgba(0,0,0,.6)",
    "z-index": "10000",
    "min-height": "50px",
    color: "white"
  })}>
<button style=${formatStyle(buttonStyle)}  id="start" >开始滚动</button>
<button id="end" style=${formatStyle(buttonStyle)}>结束滚动</button>
<button id="seeUrl" style=${formatStyle(buttonStyle)}>查看url</button>
<button id="seeAnswers" style=${formatStyle(buttonStyle)}>查看答案列表</button>
<button id="relyAnswers" style=${formatStyle(buttonStyle)}>发送答案列表</button>
<div>
<div id="totalAnswers" style=${formatStyle(detailStyle)}></div>
<div id="haveGetAnswers" style=${formatStyle(detailStyle)}></div>
</div>
</div>
`;
  try {
    div.innerHTML = `${content}`;
    document.body.appendChild(div);

    const start = document.getElementById("start");
    const end = document.getElementById("end");
    const seeUrl = document.getElementById("seeUrl");
    const seeAnswers = document.getElementById("seeAnswers");
    const total = document.getElementById("totalAnswers");
    const haveGet = document.getElementById("haveGetAnswers");
    const relyAnswers = document.getElementById("relyAnswers");
    const listItemClass = ".Card.AnswersNavWrapper .List-item";
    const listHeaderText = document.getElementsByClassName(
      "List-headerText"
    )[0];
    if (!listHeaderText || !document.querySelector(listItemClass)) {
      return (document.getElementById("electron-utils").innerHTML =
        "必要的元素不存在，看看是不是进错页面了，必须要进入一个具体的问题的页面才对");
    }

    const getList = () => document.querySelectorAll(listItemClass);

    function parseHtml(lists) {
      return Array.prototype.map.call(lists, item => {
        let shortInfo = item
          .querySelector("div.ContentItem.AnswerItem[data-zop]")
          .getAttribute("data-zop");
        if (!shortInfo) return alert("shortInfo格式错误");
        const richText = item.querySelector(
          "div.ContentItem.AnswerItem .RichContent-inner .RichText.ztext"
        );
        if (!richText) return alert("richText格式错误");
        const vote = item.querySelector(
          "div.ContentItem.AnswerItem .ContentItem-actions .VoteButton--up"
        );
        if (!vote) return alert("赞同按钮不存在");

        shortInfo = JSON.parse(shortInfo);
        const author = shortInfo.authorName;
        const id = shortInfo.itemId;
        const title = shortInfo.title;
        const type = shortInfo.type;
        return {
          id,
          author,
          title,
          type,
          content: richText.innerHTML,
          vote: vote.innerText.replace(/\n赞同 /, "")
        };
      });
    }

    start.onclick = () => {
      const answers = listHeaderText.innerHTML;
      total.innerHTML = `总共：${answers}`;
      clearInterval(window.interval);
      window.interval = setInterval(() => {
        const t = document.body.clientHeight;
        const lists = getList();
        const len = lists.length;
        haveGet.innerHTML = `已经获取${len}个答案`;
        window.scrollTo({ top: t, left: 0, behavior: "smooth" });
      }, 3000);
    };
    end.onclick = () => {
      clearInterval(window.interval);
    };
    seeUrl.onclick = () => {
      alert(document.location.href);
    };
    seeAnswers.onclick = () => {
      const answers = parseHtml(getList());
      alert(
        JSON.stringify(
          answers.map(item => ({
            id: item.id,
            author: item.author
          }))
        )
      );
    };
    relyAnswers.onclick = () => {
      window.ipc.send("relyMessage", {
        from: "app.wins.zhihuScrapy",
        to: "app.wins.main",
        data: {
          type: "answers",
          message: parseHtml(getList())
        }
      });
    };
  } catch (err) {
    console.log(err);
    alert("报错了！");
  }
});
