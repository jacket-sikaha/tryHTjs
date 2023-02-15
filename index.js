function color16() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  let color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
  return color;
}

function init() {
  dataModel = new ht.DataModel();
  graphView = new ht.graph.GraphView(dataModel);
  view = graphView.getView();
  view.className = "main";
  show.appendChild(view);
  graphView.setEditable(true);

  data3dModel = new ht.DataModel();
  g3d = new ht.graph3d.Graph3dView(data3dModel);
  view = g3d.getView();
  view.className = "main";
  graph3d.appendChild(view);

  window.addEventListener(
    "resize",
    function (e) {
      graphView.invalidate();
      g3d.invalidate();
    },
    false
  );

  g3d.setEye([-30, 100, 100]);

  for (let i = 0; i < aList.length; i++) {
    let attrName = "pro";
    let attr = (Math.random() * 56) / 100;
    let position = [100 * (i + 1) + i * 60, 100];
    let color = color16();
    let p3 = [36 * (i - 1), 0, -50];
    let s3 = [15, 15, 15];
    let twoDNode = create2DNode(position, attrName, attr, i, color);
    let threeDNode = create3DNode(p3, s3, attrName, attr, i, color);
    threeDNode.s({
      "left.color": "pink",
      "right.color": "yellow",
      "front.image": "basic",
      "back.color": "green",
      "top.color": "blue",
      "bottom.color": "orange",
      // "front.uv.offset": [0.1, 0.1],
      "front.uv.scale": [1, 1],
      label: `NO${i + 1}`,
      "label.font": "6px arial,sans-serif",
    });
    doProgress(aList[i], bList[i], twoDNode, threeDNode, attrName, attr);
  }
}

function create2DNode(p2, attrName, attr, NO, color) {
  var node = new ht.Node();
  node.setPosition(...p2);
  node.setImage("basic");
  node.setAttr(attrName, attr);
  node.setStyle("colorCircle", color);
  node.setStyle("bottomText", `NO${NO + 1}`);
  dataModel.add(node);
  return node;
}

function create3DNode(p3, s3, attrName, attr, NO, color) {
  var node = new ht.Node();
  node.p3(p3);
  node.s3(s3);
  node.setAttr(attrName, attr);
  node.setStyle("colorCircle", color);
  node.setStyle("bottomText", `NO${NO + 1}`);
  data3dModel.add(node);
  return node;
}

function doProgress(
  contentElement,
  progressElement,
  node,
  threeDNode,
  attrName,
  attr
) {
  let s = attr || 0;
  let timer = null;
  contentElement.textContent = Math.floor(s * 100) + "%";
  node.setAttr(attrName, s);
  threeDNode.setAttr(attrName, s);
  progressElement.style.width = s * wid + "px";
  timer = setInterval(() => {
    let tmp = node.getAttr(attrName);
    if (tmp + 0.01 < 1) {
      contentElement.textContent = Math.floor(tmp * 100) + 1 + "%";
      progressElement.style.width = (tmp + 0.01) * wid + "px";
      node.setAttr(attrName, tmp + 0.01);
      threeDNode.setAttr(attrName, tmp + 0.01);
    } else {
      contentElement.textContent = "100%";
      progressElement.style.width = wid + "px";
      node.setAttr(attrName, 1);
      threeDNode.setAttr(attrName, 1);
      clearInterval(timer);
      setTimeout(() => {
        node.setAttr(attrName, 0);
        threeDNode.setAttr(attrName, 0);
        contentElement.textContent = "0%";
        progressElement.style.width = "0px";
        doProgress(contentElement, progressElement, node, threeDNode, attrName);
      }, 500);
    }
  }, 100);
}

let a = document.querySelector(".a");
let b = document.querySelector(".b");
let aList = document.querySelectorAll(".a");
let bList = document.querySelectorAll(".b");
let table = document.querySelector(".table");
let show = document.querySelector(".show");
let graph3d = document.querySelector(".table-bottom");
let wid = aList[0].clientWidth;

// // 测试
// a.addEventListener("click", (e) => {
//   let tmp = node.getAttr("pro");
//   if (tmp + 0.01 < 1) {
//     a.textContent = Math.floor(tmp * 100) + 1 + "%";
//     b.style.width = (tmp + 0.01) * wid + "px";
//     node.setAttr("pro", tmp + 0.01);
//   } else {
//     a.textContent = "100%";
//     b.style.width = wid + "px";
//     node.setAttr("pro", 1);
//   }
//   setTimeout(() => {
//     if (tmp >= 1) {
//       node.setAttr("pro", 0);
//       a.textContent = "0%";
//       b.style.width = "0px";
//     }
//   }, 1500);
//   console.log(tmp, b.style.width);
// });

window.addEventListener("load", () => {
  init();
});
