// tweaklet bookmarklet

let target;
let scale = 1;
let enabled = true;
let selectedElement;
const menuWrapperId = "tweaklet-menu-wrapper";
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

const ICONS = {
  EDIT: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAfklEQVR4nNXPsQkCURAE0IeBIGoNdnH4Q8HWtAljje8nhhpoBae2IdiAyME2sAYHN9kEb9hl4DTYY/oPLvjgi5odKYE7bGNkl8XPgF30JoMrFnhELxl8xhJt9PU48C1+rpmf+8xwwhv3LN5gghWOWQxXHGJknsV9XrjEJSPKD4rTKJQFj5cRAAAAAElFTkSuQmCC",
  LAYER_UP: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA8klEQVR4nJ3TsUoDQRQF0FOIEW2FRfBTLCwEv8AqTdLY+AGmtLQVbPyQVGm28CvEgGBjoY2FxDTKwJtl2MjuxgsPBt69d+5j3tCN46itUeEWX/jGw1CjqhD+tKrTqOoQ9hrNsBogbNcqtHZxidctxG+4xl45xjk+se4QroOTuA1OsMBLJNn/I1G+8QAXeMIjzpLBKWosMcVOGI9wFZXOojcNbh3ajRGeMSmMxHkSvY0RRnFLijzHONyzURbW0ZsHt0k2iydZxD5k5NHaUavgNs+oWKR33OGojBg4xE1wejeyNBokbCOR7vERlc7/+pW93/kXzDVq6/MQwDIAAAAASUVORK5CYII=",
  LAYER_DOWN: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA3klEQVR4nN2VTQrCMBCFv5XSLjxRoRvP4tbqxk2h3suNi1zFSvUQEWEKYWjSn6QgPniLZJr3Jn2BgR9CAdwAA+xTCpfAHbBAK7Sy961Fd2yBF3ABcmADHICH1GbfyCessZ1r5Aq/A8I+o9ZnpIWvwG5ByDlwHDJyQ+yAs+q8nBhyLmc73yNwhZ5ArdYVkAkr2euFarUOvq5GPuyFTyKqkUmtF7Zy9g9DLkY6L5y6S200epNQyDbAqJDtTE4OOYYmFHJKmqGQVzFY/RdpLDUyMXPBphSeamTWms3RszgpPhQ38R1h3v6KAAAAAElFTkSuQmCC",
  DUPLICATE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAZElEQVR4nOXUWwrAIAxE0bu8Sve/Ae0+xv9C+ggxaDuQL4kHExC+HDmrAWUkIKBmvDwf2IEjYOaygBY0c1mAd3Y69c0J6MXZjwDd1PzA+jtIBa7yuG840II+OzPFiVRgs69dPR1cjsKRt7mLFwAAAABJRU5ErkJggg==",
  DELETE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAoUlEQVR4nM2TQQqDMBRE3xWEKq4M3bpybaErr9BL9BzeoXgE0Z16vxKYFEmJTRYFBwYmn/lDfsiHMO7AQ7Q6CTXwAjrR6uZX0xOYgAEYgVV6kB6lJ3m/YIA+4na9vCcP6DyTUS06INfDXYEK2IAydYQCWMQidQR3dgEmNaDSCKU3TnTATY0OuWrRARzgfwGZ/rtboBBn4BJKb3crHKL1fPAGGL0nfHYa4BsAAAAASUVORK5CYII="
}

const handleAnchorClick = (ev) => {
  ev.preventDefault();
};

const handlePointerMove = (ev) => {
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

const handlePointerUp = (ev) => {
  document.removeEventListener("pointerup", handlePointerUp);
  document.removeEventListener("pointermove", handlePointerMove);

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

const handlePointerDown = (ev) => {
  if (ev.target.className !== "tweaklet-action-button") { // ignore this event for action buttons
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
      target.style.filter = "grayscale(100%)";
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
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
      // render actionMenu
      document.getElementById(menuWrapperId)?.remove(); // remove previous menu
      renderActionMenu(ev.target);
    }
  }
};

const handleMouseLeave = (ev) => {
  if (ev.target.style.outline === "black solid 1px") {
    ev.target.style.outline = "none";
  }
  ev.target.removeEventListener("mouseleave", handleMouseLeave);
};

const handlePointerOver = (ev) => {
  if (ev.target.style.outline !== "green solid 2px") {
    ev.target.style.outline = "1px solid black";
  }
  ev.target.addEventListener("mouseleave", handleMouseLeave);
};

const duplicateElement = element => {
  const newElement = element.cloneNode(true);
  enableTweakletForElement(newElement);
  element.parentNode.appendChild(newElement);
  actionHistory.push({
    target: element,
    action: "copy",
    parent: element.parentNode,
  });
}

// TODO-ING: render action menu
// edit DONE
// delete DONE
// move forwards / backwards DONE
// copy DONE
// bring small icons in base64 here DONE
// in some elements the menu dissapear on mouse up
// add titles to menu buttons
// duplicate function shouldn't copy the action menu (you can remove it before applying action)
// the edit action (both button and shortcut) should select all the text
// add button to save changes after edition
const renderActionMenu = targetElement => {
  console.log("target el", targetElement);
  const commonBtnStyle = "background:white;cursor:pointer;padding:3px;border:1px solid gray;";
  const menu = document.createElement("div");
  menu.setAttribute("id", menuWrapperId);
  // edit
  const editBtn = document.createElement("img");
  editBtn.className = "tweaklet-action-button"
  editBtn.src = ICONS.EDIT;
  editBtn.style = commonBtnStyle;
  editBtn.onclick = (ev, target) => {
    ev.preventDefault();
    targetElement.contentEditable = true;
    console.log("target el", targetElement);
    // TODO: select all text or focus on it to indicate you can edit now
  }
  menu.appendChild(editBtn);
  // delete
  const deleteBtn = document.createElement("img");
  deleteBtn.className = "tweaklet-action-button"
  deleteBtn.src = ICONS.DELETE;
  deleteBtn.style = commonBtnStyle;
  deleteBtn.onclick = ev => {
    ev.preventDefault();
    targetElement.remove();
  }
  menu.appendChild(deleteBtn);
  // move forwards / backwards
  const moveForwardsBtn = document.createElement("img");
  moveForwardsBtn.className = "tweaklet-action-button"
  moveForwardsBtn.src = ICONS.LAYER_UP;
  moveForwardsBtn.style = commonBtnStyle;
  moveForwardsBtn.onclick = ev => {
    ev.preventDefault();
    moveForwards();
  }
  menu.appendChild(moveForwardsBtn);
  const moveBackwardsBtn = document.createElement("img");
  moveBackwardsBtn.className = "tweaklet-action-button"
  moveBackwardsBtn.src = ICONS.LAYER_DOWN;
  moveBackwardsBtn.style = commonBtnStyle;
  moveBackwardsBtn.onclick = ev => {
    ev.preventDefault();
    moveBackwards();
  }
  menu.appendChild(moveBackwardsBtn);
  // duplicate 
  const duplicateBtn = document.createElement("img");
  duplicateBtn.className = "tweaklet-action-button"
  duplicateBtn.src = ICONS.DUPLICATE;
  duplicateBtn.style = commonBtnStyle;
  duplicateBtn.onclick = ev => {
    ev.preventDefault();
    duplicateElement(targetElement);
  }
  menu.appendChild(duplicateBtn);
  
  menu.style = "position: fixed; display: flex; bottom: -30px; left: 0px; font-size: 12px; font-family: arial;";
  menu.appendChild(deleteBtn);

  targetElement.append(menu);
}

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
    e.addEventListener("pointerdown", handleAnchorClick);
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
  e.addEventListener("pointerdown", handlePointerDown);
  e.addEventListener("pointerover", handlePointerOver);
  e.setAttribute("data-tweaklet-id", generateId());
};

const handleTouchMove = ev => {
  ev.preventDefault();
};

// enable tweaklet
const enableTweaklet = () => {
  const elements = document.body.querySelectorAll("*");
  document.body.style["user-select"] = "none";
  elements.forEach((e) => {
    enableTweakletForElement(e);
  });

  // prevent scrolling on mobile while dragging
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
};

const disableTweaklet = () => {
  const elements = document.querySelectorAll("*");
  document.body.style["user-select"] = "auto";
  elements.forEach((e) => {
    // disable draggable behaviour on anchors
    if (e.nodeName === "A") {
      e.draggable = "false";
      e.removeEventListener("pointerdown", handleAnchorClick);
    }
    e.removeEventListener("pointerdown", handlePointerDown);
    e.removeEventListener("pointerover", handlePointerOver);
  });
  document.removeEventListener("touchmove", handleTouchMove);
};

// draw indicator
const indicator = document.createElement("div");
indicator.style =
  "position:fixed;top:0px;left:50%;background:palegreen;padding:0px 3px;font-size:12px;cursor:pointer";
indicator.title = "Click to enable/disable";
indicator.innerHTML = "Tweaklet enabled";
document.body.appendChild(indicator);
indicator.addEventListener("pointerdown", () => {
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
instructions.addEventListener("pointerover", () => {
  const overlay = document.createElement("div");
  overlay.style =
    "position:fixed;top:20px;left:60%;background:whitesmoke;width:400px;border:1px solid black;z-index: 100;padding:20px;";
  // - Shift + mouse wheel or +/-: resize the element<br> <-- add this when zoom feature works
  overlay.innerHTML = `- Click any element to select<br>
  - Drag any element in the page to change its position<br>
  - Ctrl + click: edit text<br> (Ctrl + Enter to finish)<br>
  - Mouse wheel or PageUp/PageDown: bring element forwards/backwards (change z-index)<br>
  - Supr: delete element<br>
  - Ctrl+C/V: copy and paste element<br>
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
    duplicateElement(copiedElement);
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
  } else if (ev.key === "+") {
    // zoomIn();
  } else if (ev.key === "-") {
    // zoomOut();
  } else if (ev.key === "PageUp") {
    moveBackwards();
  } else if (ev.key === "PageDown") {
    moveForwards();
  } else if (ev.key !== "Shift" && ev.key !== "Control") {
    actionHistory.push({
      target: ev.target,
      action: "edit",
      value: ev.target.innerHTML,
    });
  }
});

  // TODO: this is a disaster.. why cannot just add a Regexp to replace whatever is inside scale(x) with its own value + 0.1  ????
  // If I'm not able to do this I will remove this feature and add a task for the future
  // declare RegExp to select scale value
  // use it to read current value
  // use it again to replace current value
  // set default value in case it doesn't exist

const zoomIn = () => {
  // if (!selectedElement.getAttribute("data-tweaklet-scale")) {
  //   selectedElement.setAttribute("data-tweaklet-scale", 1);
  // }
  // const currentScale = Number(selectedElement.getAttribute("data-tweaklet-scale")).toFixed(1);
  



  // console.log("zoomin currentScale", currentScale); 
  // console.log("transform", selectedElement.style.transform);
  // if (selectedElement.style.transform.includes('scale')) {
  //     selectedElement.style.transform = selectedElement.style.transform.replace(/scale\(.*\)/, `scale(${currentScale + 0.1})`)
  //     console.log("transform after", selectedElement.style.transform);
  //   } else {
  //     console.log("trans", (Number(selectedElement.getAttribute("data-tweaklet-scale")) + 0.1).toFixed(1))
  //   // selectedElement.style.transform.replace(/scale\(.*\)/, '');
  //   selectedElement.style.transform += `scale(${(Number(selectedElement.getAttribute("data-tweaklet-scale")) + 0.1).toFixed(1)})`;
  //   console.log("new value!!", selectedElement.style.transform);
  // }
  // selectedElement.setAttribute("data-tweaklet-scale", String(Number(selectedElement.getAttribute("data-tweaklet-scale")) + 0.1));
  // scale += 0.1;
  actionHistory.push({
    target: selectedElement,
    action: "scale",
    value: selectedElement.style.transform,
  });
};

const zoomOut = () => {
  if (!selectedElement.getAttribute("data-tweaklet-scale")) {
    selectedElement.setAttribute("data-tweaklet-scale", 1);
  }  
  const currentScale = selectedElement.getAttribute("data-tweaklet-scale");
  if (selectedElement.style.transform.includes(`scale(${currentScale})`)) {
    selectedElement.style.transform =
    selectedElement.style.transform.replace(
      `scale(${currentScale})`,
      `scale(${currentScale - 0.1})`
      );
    } else {
      selectedElement.style.transform += `scale(${Number(selectedElement.getAttribute("data-tweaklet-scale"))})`;
    }
    selectedElement.setAttribute("data-tweaklet-scale", String(Number(selectedElement.getAttribute("data-tweaklet-scale")) - 0.1));
  actionHistory.push({
    target: selectedElement,
    action: "scale",
    value: selectedElement.style.transform,
  });
};

const moveForwards = () => {
    // move forward/backwards
    selectedElement.style.zIndex = String(
    Number(selectedElement.style.zIndex) + 1
  );
  actionHistory.push({
    target: selectedElement,
    action: "z-index",
    value: selectedElement.style.zIndex,
  });
}

const moveBackwards = () => {
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

document.addEventListener("wheel", (ev) => {
  if (selectedElement) {
    ev.stopPropagation();
    if (ev.deltaY > 0 && ev.shiftKey) {
      // zoomOut(); // TODO: re-enable feature when fixed
    } else if (ev.deltaY < 0 && ev.shiftKey) {
      // zoomIn(); // TODO: re-enable feature when fixed
    } else if (ev.deltaY > 0) {
      moveForwards();
    } else if (ev.deltaY < 0) {
      moveBackwards();
    }
  }
});

enableTweaklet();
