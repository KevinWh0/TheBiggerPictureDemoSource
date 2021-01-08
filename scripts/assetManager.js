/*TODO


  Scale the browser window
  var w = window.outerWidth;
  var h = window.outerHeight;


  Detect Browser window position 
  window.screenX || window.screenLeft;
  window.screenY || window.screenTop;
  
 */

import { Player } from "./player.js";
import { Viewport } from "./viewport.js";
import {
  Tile,
  changeImageOnPlayerCollide,
  SolidPlayerCollider,
  animatedTile,
  BackgroundTile,
  ConnectedTextureComponent,
  AnimationComponent,
  SolidPlayerColliderNotData,
  nextlevelTeleporter,
  TextPlayerCollider,
  runIfMetadata,
  setTileButton,
  clickerTile,
  SpecifiedConnectedTextureComponent,
} from "./tiles.js";
import {
  cropImage,
  game,
  isPlaying,
  loadImg,
  offline,
  setOffline,
} from "./toolbox.js";
import { doorConditions, getDoorCondition } from "./doorConditionManager.js";

export let editingMap = false;
export let placing = 0;
export let placingType = 0;
export function setPlacingType(type) {
  placingType = type;
}

export let music = [];
music.push(new Audio(`./assets/AUDIO/music/lab_song_no3.mp3`));
music.push(new Audio(`./assets/AUDIO/music/labtry3.mp3`));
music.push(new Audio(`./assets/AUDIO/music/KevinWhos_Song_1.wav`));

music.forEach((m) => {
  m.volume = 0.2;
});

export let sounds = {
  doorOpen: new Audio("./assets/AUDIO/SFX/doorOpen.wav"),
  portal: new Audio("./assets/AUDIO/SFX/portal.wav"),
};
sounds.portal.volume = 0.2;
sounds.doorOpen.volume = 0.5;
sounds.doorOpen.play();
/*
0 = blocks
1 = crates
2 = edit metadata tool

*/

export function setPlacing(p) {
  placing = p;
}

export let levelOn = 0;
export let playedDoorSound = false;
export function setLevel(lvl) {
  levelOn = lvl;
  playedDoorSound = false;
}

export let loadingLevel = false;
export function setLoadingLevel(l) {
  loadingLevel = l;
}

export let presenceTypes = {
  startOfLevel: "start",
  DoingLevel: "main",
  BeatLevel: "pass",
};
export let levelPresense = "start";
export function setLevelPresense(p) {
  levelPresense = p;
}

export let tiles = {
  labFloor: new Image(),
  redButton: new Image(),
  redButtonPushed: new Image(),
  wall: loadImg("./assets/tiles/Wall.png"),
  crate: loadImg("./assets/tiles/Crate.png"),
};
tiles.labFloor.src = "./assets/tiles/LabFloor.png";
tiles.redButton.src = "./assets/tiles/RedButton.png";
tiles.redButtonPushed.src = "./assets/tiles/RedButtonPushed.png";

export let playerImg = {
  Right: loadImg("./assets/player/playerRight.png"),
  Left: loadImg("./assets/player/playerLeft.png"),
  Up: loadImg("./assets/player/playerUp.png"),

  playerRightRun: loadImg("./assets/player/playerRightRun.png"),
  playerLeftRun: loadImg("./assets/player/playerLeftRun.png"),
  playerUpRun: loadImg("./assets/player/playerUpRun.png"),
};

export let mapWidth = 20;
export let mapHeight = 20;

export function setMapSize(w, h) {
  mapWidth = w;
  mapHeight = h;
}

export let map = new Array(mapWidth);
export let mapData = new Array(mapWidth);

for (let i = 0; i < map.length; i++) {
  map[i] = new Array(mapHeight);
  mapData[i] = new Array(mapHeight);
}

for (let i = 0; i < mapWidth; i++) {
  for (let j = 0; j < mapHeight; j++) {
    map[i][j] = 0;
    mapData[i][j] = 0;
    //map[i][j] = Math.round(Math.random());
  }
}

export let blockSize = 90;

export let player = new Player(700, 470);
export let viewport = new Viewport();

export let tileSet = new Map();
tileSet.set(0, new Tile(tiles.labFloor));
tileSet.set(
  1,
  new Tile(tiles.redButton)
    .addComponent(
      new changeImageOnPlayerCollide(tiles.redButton, tiles.redButtonPushed)
    )
    .addComponent(new setTileButton(5))
);
tileSet.set(
  2,
  new Tile(loadImg("./assets/tiles/Transparent.png"))
    .addComponent(new SolidPlayerCollider())
    .addComponent(
      new ConnectedTextureComponent(loadImg("./assets/tiles/Walls1.png"))
    )
);

tileSet.set(
  3,
  new Tile(loadImg("./assets/tiles/HologramInfo1.png"))
    .addComponent(new BackgroundTile(tiles.labFloor))
    .addComponent(
      new animatedTile(
        30,
        loadImg("./assets/tiles/HologramInfo1.png"),
        loadImg("./assets/tiles/HologramInfo2.png")
      )
    )
    .addComponent(new TextPlayerCollider())
);
export let animComp = new AnimationComponent(
  loadImg("./assets/tiles/Door.png"),
  4
);
let condition = () => {
  let dc = getDoorCondition(levelOn);
  if (dc && !isPlaying(sounds.doorOpen) && !playedDoorSound) {
    sounds.doorOpen.play();
    playedDoorSound = true;
  }
  return dc;
};
animComp.setCondition(condition);

//tilesMap.set(4, new Tile(loadImg("./assets/tiles/Transparent.png")));
tileSet.set(
  4,
  new Tile(loadImg("./assets/tiles/Transparent.png"))
    .addComponent(new BackgroundTile(tiles.labFloor))
    .addComponent(new SolidPlayerColliderNotData(3))
    .addComponent(animComp)
);
//

//Active Portal Block
tileSet.set(
  5,
  new Tile(loadImg("./assets/tiles/PortalInActive.png"))
    .addComponent(new BackgroundTile(tiles.labFloor))

    .addComponent(
      new AnimationComponent(
        loadImg("./assets/tiles/PortalActive.png"),
        4
      ).setLooping(true),
      1
    )
    .addComponent(
      new runIfMetadata().addComponent(new nextlevelTeleporter(), 1)
    )
);

tileSet.set(
  6,
  new Tile(loadImg("./assets/tiles/PortalInActive.png"))

    .addComponent(new BackgroundTile(tiles.labFloor), "inactive")
    .addComponent(
      new BackgroundTile(loadImg("./assets/tiles/PortalInActive.png")),
      "inactive"
    )
);

//NUMBER TILE
tileSet.set(
  6,
  new Tile(loadImg("./assets/tiles/PortalInActive.png"))

    .addComponent(new BackgroundTile(tiles.labFloor), "inactive")
    .addComponent(new clickerTile(renderNumber, 13))
);

tileSet.set(
  7,
  new Tile(loadImg("./assets/tiles/Transparent.png"))
    .addComponent(new BackgroundTile(tiles.labFloor))
    .addComponent(new SolidPlayerColliderNotData(3))
    .addComponent(
      new AnimationComponent(
        loadImg("./assets/tiles/WifiDoor-sheet.png"),
        4
      ).setCondition(condition)
    )
);

tileSet.set(
  8,
  new Tile(loadImg("./assets/tiles/WallsMic.png")).addComponent(
    new SolidPlayerCollider()
  )
);

/*
tilesMap.set(
  4,
  new Tile(loadImg("./assets/tiles/Door.png")).addComponent(
    new BackgroundTile(tiles.labFloor)
  )
);*/

export let backgroundImgArray = [];
backgroundImgArray.push(playerImg.Left);
backgroundImgArray.push(loadImg("./assets/tiles/Transparent.png"));
backgroundImgArray.push(loadImg("./assets/tiles/Transparent.png"));
backgroundImgArray.push(loadImg("./assets/tiles/Transparent.png"));
backgroundImgArray.push(loadImg("./assets/tiles/Transparent.png"));
backgroundImgArray.push(loadImg("./assets/tiles/Transparent.png"));
backgroundImgArray.push(loadImg("./assets/tiles/Transparent.png"));
backgroundImgArray.push(loadImg("./assets/tiles/Transparent.png"));
backgroundImgArray.push(loadImg("./assets/tiles/Transparent.png"));
backgroundImgArray.push(loadImg("./assets/tiles/Transparent.png"));
backgroundImgArray.push(loadImg("./assets/tiles/Transparent.png"));
backgroundImgArray.push(loadImg("./assets/tiles/Transparent.png"));
backgroundImgArray.push(loadImg("./assets/tiles/Transparent.png"));
backgroundImgArray.push(loadImg("./assets/tiles/Transparent.png"));

//export let _1to12 = loadImg("./assets/tiles/Numbers1-12.png");
export let _1to12 = loadImg("./assets/tiles/Numbers1-12-sheet.png");

/**
 *
 * @param {Number} number - A number between 1 - 12
 */
export function renderNumber(number, x, y, w, h) {
  cropImage(_1to12, x, y, w, h, number * 16, 0, 16, 16);
}

export let credits = {
  Programming: "KevinWho",
  Music: "Tyler Buchinski & Iamproudofmyself",
  "Narration co-writer": "mental.bloxx",
  "Narrator [Coming Soon]": "AlcesXV",
};
