/* tweaklet bookmarklet
// The aim of this demo is to create a bookmarklet
// to modify elements on the page */

let target;
let scale = 1;
let enabled = true;
let selectedElement;
const inlineElements = [
  "A",
  "ABBR",
  "ACRONYM",
  "B",
  "BDI",
  "BDO",
  "BIG",
  "BR",
  "BUTTON",
  "CANVAS",
  "CITE",
  "CODE",
  "DATA",
  "DATALIST",
  "DEL",
  "DFN",
  "DEL",
  "DFN",
  "EM",
  "EMBED",
  "I",
  "IFRAME",
  "IMG",
  "INPUT",
  "INS",
  "KBD",
  "LABEL",
  "MAP",
  "MARK",
  "METER",
  "NOSCRIPT",
  "OBJECT",
  "OUTPUT",
  "PICTURE",
  "PROGRESS",
  "Q",
  "RUBY",
  "S",
  "SAMP",
  "SCRIPT",
  "SELECT",
  "SLOT",
  "SMALL",
  "SPAN",
  "STRONG",
  "SUB",
  "SUP",
  "SVG",
  "TEMPLATE",
  "TEXTAREA",
  "TIME",
  "U",
  "TT",
  "VAR",
  "VIDEO",
  "WBR",
];
const actionHistory = [];
let copiedElement;

const handleAnchorClick = (ev) => {
  ev.preventDefault();
};

const handleMouseMove = (ev) => {
  if (target) {
    if (target.style.transform.includes("translate")) {
      target.style.transform = target.style.transform.replace(
        /translate\(.*\)/,
        `translate(${ev.clientX - target.originalLeft}px, ${
          ev.clientY - target.originalTop
        }px)`
      );
    } else {
      target.style.transform += ` translate(${
        ev.clientX - target.originalLeft
      }px, ${ev.clientY - target.originalTop}px)`;
    }
  }
};

const handleMouseUp = (ev) => {
  document.removeEventListener("mouseup", handleMouseUp);
  document.removeEventListener("mousemove", handleMouseMove);
  if (target) {
    target.style.filter = "none";
  }
  const left = ev.clientX;
  const top = ev.clientY;
  if (
    actionHistory.at(-1).action === "move" &&
    actionHistory.at(-1).value.left === left &&
    actionHistory.at(-1).value.top === top
  ) {
    actionHistory.pop();
  } else {
    actionHistory.push({
      target,
      action: "move",
      value: { left, top },
    });
  }
  target = null;
};

const handleMouseDown = (ev) => {
  if (ev.ctrlKey && ev.button === 0) {
    ev.stopPropagation();
    ev.target.contentEditable = true;
  } else if (ev.button === 0) {
    ev.stopPropagation();
    if (selectedElement) {
      selectedElement.style.outline = "none";
    }
    selectedElement = ev.target;
    selectedElement.style.outline = "2px solid green";
    target = ev.target;
    target.style.filter = "blur(1px) grayscale(100%)";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    const entries = getHistoryEntriesBy(
      target.getAttribute("data-tweaklet-id"),
      "move"
    );
    if (entries && entries.length === 0) {
      actionHistory.push({
        target,
        action: "move",
        value: { left: ev.target.originalLeft, top: ev.target.originalTop },
      });
    }
  }
};

const handleMouseLeave = (ev) => {
  if (ev.target.style.outline === "black solid 1px") {
    ev.target.style.outline = "none";
  }
  ev.target.removeEventListener("mouseleave", handleMouseLeave);
};

const handleMouseOver = (ev) => {
  if (ev.target.style.outline !== "green solid 2px") {
    ev.target.style.outline = "1px solid black";
  }
  ev.target.addEventListener("mouseleave", handleMouseLeave);
};

const getHistoryEntriesBy = (targetId, action) =>
  targetId && action
    ? actionHistory.filter(
        (x) =>
          x.action === action &&
          x.target.getAttribute("data-tweaklet-id") === targetId
      )
    : null;

const generateId = (length = 4) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// enable tweaklet for one element
const enableTweakletForElement = (e) => {
  // disable draggable behaviour on anchors
  if (e.nodeName === "A") {
    e.draggable = "false";
    e.addEventListener("click", handleAnchorClick);
  }
  // inline elements
  if (inlineElements.includes(e.nodeName)) {
    e.style.display = "inline-block";
  }
  const rect = e.getBoundingClientRect();
  if (!e.style) {
    e.style = {};
  }
  e.originalTop = rect.top;
  e.originalLeft = rect.left;
  e.addEventListener("mousedown", handleMouseDown);
  e.addEventListener("mouseover", handleMouseOver);
  e.setAttribute("data-tweaklet-id", generateId());
};

// enable tweaklet
const enableTweaklet = () => {
  const elements = document.body.querySelectorAll("*");
  document.body.style["user-select"] = "none";
  elements.forEach((e) => {
    enableTweakletForElement(e);
  });
};

const disableTweaklet = () => {
  const elements = document.querySelectorAll("*");
  document.body.style["user-select"] = "auto";
  elements.forEach((e) => {
    // disable draggable behaviour on anchors
    if (e.nodeName === "A") {
      e.draggable = "false";
      e.removeEventListener("click", handleAnchorClick);
    }
    e.removeEventListener("mousedown", handleMouseDown);
    e.removeEventListener("mouseover", handleMouseOver);
  });
};

// draw indicator
const indicator = document.createElement("div");
indicator.style =
  "position:fixed;top:0px;left:50%;background:palegreen;padding:0px 3px;font-size:12px;cursor:pointer";
indicator.title = "Click to enable/disable";
indicator.innerHTML = "Tweaklet enabled";
document.body.appendChild(indicator);
indicator.addEventListener("click", () => {
  if (enabled) {
    indicator.style.background = "red";
    indicator.innerHTML = "Tweaklet disabled";
    disableTweaklet();
    enabled = false;
  } else {
    indicator.style.background = "palegreen";
    indicator.innerHTML = "Tweaklet enabled";
    enableTweaklet();
    enabled = true;
  }
});

// draw instructions
const instructions = document.createElement("div");
instructions.style =
  "position:fixed;top:0px;left:calc(50vw + 120px);background:orange;padding:0px 3px;font-size:14px;cursor:pointer";
instructions.innerHTML = "?";
document.body.appendChild(instructions);
instructions.addEventListener("mouseover", () => {
  const overlay = document.createElement("div");
  overlay.style =
    "position:fixed;top:20px;left:60%;background:whitesmoke;width:400px;border:1px solid black;z-index: 100;padding:20px;";
  overlay.innerHTML = `- Click any element to select<br>
  - Drag any element in the page to change its position<br>
  - Ctrl + click: edit text<br> (Ctrl + Enter to finish)<br>
  - Shift + mouse wheel: resize the element<br>
  - Mouse wheel: bring element forwards/backwards (change z-index)<br>
  - Supr: delete element<br>
  - Ctrl+Z: to undo changes<br><br>
  know more: tweaklet.com
  `;
  document.body.appendChild(overlay);
  instructions.addEventListener("mouseleave", () => {
    overlay.parentNode?.removeChild(overlay);
  });
});

document.addEventListener("keydown", (ev) => {
  if (ev.key === "z" && ev.ctrlKey && actionHistory.length > 0) {
    // Ctrl+Z event
    const lastChange = actionHistory.pop();
    switch (lastChange.action) {
      case "move":
        lastChange.target.style.transform = `translate(${
          lastChange.value.left - lastChange.target.originalLeft
        }px, ${lastChange.value.top - lastChange.target.originalTop}px)`;
        break;
      case "edit":
        lastChange.target.innerHTML = lastChange.value;
        break;
      case "scale":
        lastChange.target.style.transform = lastChange.value;
        break;
      case "z-index":
        lastChange.target.style.zIndex = lastChange.value;
        break;
      case "remove":
        lastChange.parent.insertBefore(
          lastChange.target,
          lastChange.parent.children[lastChange.index]
        );
        break;
      case "copy":
        lastChange.parent.removeChild(lastChange.target);
        break;
    }
  } else if (ev.key === "c" && ev.ctrlKey) {
    // Ctrl+C event
    copiedElement = selectedElement;
  } else if (ev.key === "v" && ev.ctrlKey) {
    // Ctrl+V event
    const newElement = copiedElement.cloneNode(true);
    enableTweakletForElement(newElement);
    copiedElement.parentNode.appendChild(newElement);
    actionHistory.push({
      target: copiedElement,
      action: "copy",
      parent: copiedElement.parentNode,
    });
  } else if (ev.key === "Enter" && ev.ctrlKey) {
    // Ctrl+Enter event
    ev.target.contentEditable = false;
  } else if (ev.key === "Delete") {
    actionHistory.push({
      target: selectedElement,
      action: "remove",
      index: 0,
      parent: selectedElement.parentNode,
    });
    selectedElement.remove();
    selectedElement = null;
  } else if (ev.key === "Escape") {
    selectedElement.style.outline = "none";
    selectedElement = null;
  } else if (ev.key !== "Shift" && ev.key !== "Control") {
    actionHistory.push({
      target: ev.target,
      action: "edit",
      value: ev.target.innerHTML,
    });
  }
});

document.addEventListener("wheel", (ev) => {
  if (selectedElement) {
    ev.stopPropagation();
    if (ev.deltaY > 0 && ev.shiftKey) {
      // scale
      if (selectedElement.style.transform.includes(`scale(${scale})`)) {
        selectedElement.style.transform =
          selectedElement.style.transform.replace(
            `scale(${scale})`,
            `scale(${scale - 0.1})`
          );
      } else {
        selectedElement.style.transform += `scale(${scale - 0.1})`;
      }
      scale -= 0.1;
      actionHistory.push({
        target: selectedElement,
        action: "scale",
        value: selectedElement.style.transform,
      });
    } else if (ev.deltaY < 0 && ev.shiftKey) {
      if (selectedElement.style.transform.includes(`scale(${scale})`)) {
        selectedElement.style.transform =
          selectedElement.style.transform.replace(
            `scale(${scale})`,
            `scale(${scale + 0.1})`
          );
      } else {
        selectedElement.style.transform += `scale(${scale + 0.1})`;
      }
      scale += 0.1;
      actionHistory.push({
        target: selectedElement,
        action: "scale",
        value: selectedElement.style.transform,
      });
    } else if (ev.deltaY > 0) {
      // move forward/backwards
      selectedElement.style.zIndex = String(
        Number(selectedElement.style.zIndex) + 1
      );
      actionHistory.push({
        target: selectedElement,
        action: "z-index",
        value: selectedElement.style.zIndex,
      });
    } else if (ev.deltaY < 0) {
      selectedElement.style.zIndex =
        Number(selectedElement.style.zIndex) >= 0
          ? String(Number(selectedElement.style.zIndex) - 1)
          : "0";
      actionHistory.push({
        target: selectedElement,
        action: "z-index",
        value: selectedElement.style.zIndex,
      });
    }
  }
});

enableTweaklet();
