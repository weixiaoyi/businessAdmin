// alert(window.ipc, "-----");
// const getHeight = () => {
//   setInterval(() => {
//     const t = document.body.clientHeight;
//     console.log(t);
//     //window.scrollTo({ top: t, left: 0, behavior: "smooth" });
//   }, 3000);
// };
window.ipc.on("createUtils", () => {
  const div = document.createElement("div");
  div.style.position = "fixed";
  div.style.top = "0";
  div.style.background = "red";
  div.style.zIndex = "10000";
  div.innerHTML = "<div>hahahha</div>";

  document.body.appendChild(div);
});
