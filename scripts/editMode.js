import { boxes } from "../index.js";
import {
  editingMap,
  mapData,
  placingType,
  player,
  setPlacingType,
  tiles,
  viewport,
} from "./assetManager.js";
import { pushableBox } from "./pushablebox.js";
import {
  fill,
  inArea,
  mousePressed,
  mouseX,
  mouseY,
  rect,
  renderImage,
  replaceAll,
} from "./toolbox.js";

export function runEditMode() {
  //if (editingMap) {

  if (placingType == 1) showEntities();
  if (placingType == 2) editMeta();

  renderImage(tiles.crate, 0, 100, 40, 40);
  if (mousePressed && inArea(mouseX, mouseY, 0, 100, 40, 40)) {
    setPlacingType(1);
  }
  fill("red");
  rect(0, 150, 40, 40);
  if (mousePressed && inArea(mouseX, mouseY, 0, 150, 40, 40)) {
    setPlacingType(2);
  }
  //}
}
export let selectedTile = { x: 0, y: 0 };
export function setSelectedTile(X, Y) {
  selectedTile = { x: X, y: Y };
  try {
    document.getElementById("metaMod").value = replaceAll(
      mapData[selectedTile.x][selectedTile.y],
      "_",
      " "
    );
  } catch (err) {
    //document.getElementById("metaMod").value = "0";
  }
}
function editMeta() {
  if (!document.getElementById("metaMod")) {
    let input = document.createElement("input");
    input.id = "metaMod";
    input.type = "text";
    input.style.position = "absolute";
    (input.style.top = "50px"), (input.style.left = "50px");
    document.getElementById("canvasHolder").appendChild(input);
  }
  mapData[selectedTile.x][selectedTile.y] = document
    .getElementById("metaMod")
    .value.split(" ")
    .join("_");
}

export function showEntities() {
  let placingPos = {
    x: viewport.x + mouseX,
    y: viewport.y + mouseY,
  };
  if (placingType == 1 && mousePressed)
    boxes.push(new pushableBox(placingPos.x, placingPos.y));
}
