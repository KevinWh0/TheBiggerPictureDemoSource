import {
  blockSize,
  editingMap,
  map,
  mapData,
  mapHeight,
  mapWidth,
  placing,
  placingType,
  tiles,
  tileSet,
  viewport,
} from "./assetManager.js";
import { selectedTile, setSelectedTile } from "./editMode.js";
import {
  fill,
  height,
  inArea,
  mouseDown,
  mouseX,
  mouseY,
  offsetVibX,
  offsetVibY,
  rect,
  renderImage,
  width,
} from "./toolbox.js";

export function loadLvl(lvl) {
  loadWorld(getLvlUrl(lvl));
}

export function renderLvl() {
  //!TODO a lot of these vars dont exits because its taken from the devils dungeon, create
  //!TODO them
  for (var i = 0; i < mapWidth; i++) {
    for (var j = 0; j < mapHeight; j++) {
      if (
        mouseDown &&
        inArea(
          mouseX,
          mouseY,
          i * blockSize - viewport.x,
          j * blockSize - viewport.y,
          blockSize,
          blockSize
        ) &&
        mouseX < width - 50
      ) {
        if (editingMap && placingType == 0) {
          map[i][j] = placing;
          mapData[i][j] = 0;
        }
        setSelectedTile(i, j);
      }

      /*if (
        inArea(
          i * blockSize - viewport.x,
          j * blockSize - viewport.y,
          -80,
          -80,
          width + 80,
          height + 80
        )
      )*/
      /*renderImage(
          tiles.labFloor,
          i * blockSize - viewport.x,
          j * blockSize - viewport.y,
          blockSize,
          blockSize
        );*/
      //console.log(tilesMap.get(map[i][j]));
      //if (map[i][j] != 0) console.log(map[i][j]);
      //console.log(tilesMap.get(parseInt(map[i][j])), map[i][j]);
      tileSet
        .get(map[i][j])
        .renderTile(
          i * blockSize - viewport.x + offsetVibX,
          j * blockSize - viewport.y + offsetVibY,
          blockSize,
          blockSize,
          i,
          j
        );

      if (placingType == 2) {
        fill("rgba(255, 0, 0, 0.005)");
        rect(
          selectedTile.x * blockSize - viewport.x,
          selectedTile.y * blockSize - viewport.y,
          blockSize,
          blockSize
        );
      }

      /*blocks
      .get(map[i][j])
      .update(
        i * blockSize + mapoffsetX,
        j * blockSize + mapoffsetY,
        blockSize,
        blockSize
      );
    blocks
      .get(map[i][j])
      .render(
         i * blockSize + mapoffsetX,
        j * blockSize + mapoffsetY,
        blockSize,
        blockSize
      );*/
    }
  }
}
