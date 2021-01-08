import {
  backgroundImgArray,
  blockSize,
  credits,
  editingMap,
  levelOn,
  loadingLevel,
  music,
  placingType,
  player,
  renderNumber,
  setLevel,
  setLoadingLevel,
  setPlacing,
  setPlacingType,
  sounds,
  tiles,
  tileSet,
  viewport,
} from "./scripts/assetManager.js";
import { runEditMode, selectedTile } from "./scripts/editMode.js";
import { getLevelPath } from "./scripts/levelManager.js";
import { renderLvl } from "./scripts/mapRenderer.js";
import {
  DefaultSquareParticleRendererRotate,
  GravityUpdater,
  ParticleSystem,
} from "./scripts/particles.js";
import { pushableBox } from "./scripts/pushablebox.js";
import { resetDelay, runDialogue } from "./scripts/speach.js";

import {
  game,
  text,
  textWraped,
  fill,
  setFontSize,
  renderImage,
  width,
  height,
  resetMousePressed,
  mousePressed,
  mouseDown,
  mouseX,
  mouseY,
  inArea,
  rect,
  keyPressed,
  keys,
  keyReleased,
  button,
  background,
  setTitle,
  setIcon,
  DownloadWorld,
  loadWorld,
  loadImg,
  getTextWidth,
  imageBackground,
  scrollImageBackground,
  scrollImageBackgroundSeed,
  setBlur,
  playRandomSong,
  isMusicListPlaying,
  isPlaying,
} from "./scripts/toolbox.js";

export let states = {
  game: "game",
  menu: "menu",
  settings: "settings",
  win: "win",
  startScreen: "start",
};

export let state = states.startScreen;
export function setState(s) {
  state = s;
}

game.start();
var lastRender = Date.now();
export let fps;

setTitle("The Bigger Picture!");
//setIcon("./icon.png");
export let boxes = [];
export function resetBoxes() {
  boxes = [];
}
//boxes.push(new pushableBox(100, 100));

export let displayText = "";
export function setDisplayText(t) {
  displayText = t;
}

export function updateGameArea() {
  var delta = (Date.now() - lastRender) / 1000;
  lastRender = Date.now();
  fps = Math.round(1 / delta);
  game.clear();
  game.frameNo += 1;

  switch (state) {
    case states.game:
      if (!isMusicListPlaying(music)) playRandomSong(music);
      //if (!isPlaying(sounds.labambience)) sounds.labambience.play();
      background("#001f3f");
      if (!loadingLevel) {
        renderLvl();

        //console.log(`URL: ${window.parent.parent.parent}`);
        boxes.forEach((box) => {
          box.runBox();
        });
        player.update();
        viewport.update();

        player.render();
        fill("white");
        setFontSize(50, "Ariel");
        textWraped(displayText, 20, (height / 5) * 4, width - 40, 1000);
        setFontSize(14, "Ariel");

        displayText = "";
      } else {
        //loadWorld("./assets/levels/e.txt");
        //setLoadingLevel(false);
      }

      if (editingMap) {
        for (let i = 0; i < tileSet.size; i++) {
          tileSet.get(i).renderTile(width - 50, i * 50, 50, 50, 2, 2);
          if (
            mousePressed &&
            inArea(mouseX, mouseY, width - 50, i * 50, 50, 50)
          ) {
            setPlacing(i);
            setPlacingType(0);
          }
        }
        runEditMode();
        //rect(0, 0, 50, 50);
        if (mousePressed && inArea(mouseX, mouseY, 0, 0, 50, 50)) {
          DownloadWorld();
        }
      }
      //fps counter below
      fill("black");
      text(
        `FPS: ${fps} XY: ${player.x} ${
          player.y
        }   Debug Mode: ${editingMap}    levelOn: ${levelOn}   Selected Tile: ${
          selectedTile.x + " " + selectedTile.y
        }`,
        10,
        10
      );

      runDialogue();

      break;
    case states.menu:
      background("black");
      //setBlur("0.2px");
      scrollImageBackground(tiles.labFloor, 100);
      background("rgba(0,0,0,0.5)");

      //setBlur("0px");

      //scrollImageBackgroundSeed(backgroundImgArray, 100);

      setFontSize(Math.round(width / 20), "VT323");
      fill("white");
      /*text(
        "The Bigger Picture",
        width / 2 - Math.round(getTextWidth("The Bigger Picture") / 2),
        50
      );*/
      text("The", width / 2 - Math.round(getTextWidth("The") / 2), 60);
      setFontSize(Math.round(width / 10), "VT323");
      text(
        "Bigger",
        width / 2 - Math.round(getTextWidth("Bigger") / 2),
        60 + width / 20
      );
      setFontSize(Math.round(width / 20), "VT323");
      text(
        "Picture",
        width / 2 - Math.round(getTextWidth("Picture") / 2),
        60 + width / 10
      );

      setFontSize(width / 30, "VT323");

      button("Play", width / 2, height / 2, 100, 60, 10, () => {
        state = states.game;
        resetDelay();
      });

      fill("white");
      for (let i = 0; i < Object.keys(credits).length; i++) {
        text(
          `${credits[Object.keys(credits)[i]]} - ${Object.keys(credits)[i]}`,
          8,
          height - Object.keys(credits).length * (width / 50) + i * (width / 40)
        );
      }
      break;
    case states.win:
      scrollImageBackground(tiles.labFloor, 100);
      scrollImageBackgroundSeed(backgroundImgArray, 100);
      background("rgba(0,0,0,0.5)");
      setFontSize(width / 10, "VT323");
      fill("white");
      text(
        "You Win!",
        width / 2 - Math.round(getTextWidth("You Win!") / 2),
        50 + width / 20
      );
      setFontSize(width / 30, "VT323");

      button("Menu", width / 2, (height / 4) * 3, 100, 50, 0, () => {
        state = states.menu;
        setLevel(0);
        loadWorld(getLevelPath(levelOn)());
      });
      break;
    case states.startScreen:
      fill("white");
      setFontSize(width / 40, "VT323");

      textWraped(
        "Hello, for the sake of this game, please have it in fullscreen; Also Be ready to think outside the box!        NLNLNLAlso Please note that this game contains bugs and is more of a DEMO. A full game might come out later. Follow me on @kevinwho5 on twitter for updates.",
        20,
        80,
        width - 40,
        width / 40
      );
      button(
        "Continue.... I am not streaming this.",
        width / 2,
        height - 90,
        100,
        50,
        0,
        () => {
          state = states.menu;
          setLevel(0);
          loadWorld(getLevelPath(levelOn)());
        }
      );
      setFontSize(width / 70, "VT323");

      button(
        "Are you streaming or have Ethernet? Click here. This makes level 1 a cake walk, but pay attention to what he says, it will help you later.",
        width / 2,
        (height / 4) * 3,
        100,
        50,
        0,
        () => {
          setLevel(0);
          loadWorld(`./assets/levels/level0Streamer.txt`);
          state = states.menu;
        }
      );
      break;
    default:
      state = states.menu;
      break;
  }

  resetMousePressed();
}
