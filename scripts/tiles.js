import { boxes, setDisplayText } from "../index.js";
import {
  levelOn,
  levelPresense,
  map,
  mapData,
  setLevel,
  setLevelPresense,
  setLoadingLevel,
  sounds,
  tileSet,
} from "./assetManager.js";
import { blockSize, player, viewport } from "./assetManager.js";
import { getLevelPath } from "./levelManager.js";
import {
  DefaultSquareParticleRendererRotate,
  GravityUpdater,
  ParticleSystem,
} from "./particles.js";
import { resetDelay, resetSpeachOn } from "./speach.js";
import {
  cropImage,
  getByValue,
  loadImg,
  loadWorld,
  mousePressed,
  mouseX,
  mouseY,
  offline,
} from "./toolbox.js";
import {
  game,
  height,
  inArea,
  intersects,
  renderImage,
  width,
} from "./toolbox.js";

export class Tile {
  img;
  tempImg;
  components = [];
  id;
  constructor(img) {
    this.img = img;
  }

  renderTile(x, y, w, h, i, j) {
    if (this.id == undefined) this.id = getByValue(tileSet, this);
    this.tempImg = this.img;
    this.components.forEach((component) => {
      component.run(this, x, y, w, h, this.id, i, j);
    });
    renderImage(this.tempImg, x, y, w, h);
  }

  setTempImg(img) {
    this.tempImg = img;
  }

  addComponent(c) {
    this.components.push(c);
    return this;
  }
}

export class changeImageOnPlayerCollide {
  img1;
  img2;

  constructor(img1, img2) {
    this.img1 = img1;
    this.img2 = img2;
  }
  run(tile, x, y, w, h) {
    if (inArea(player.x - viewport.x, player.y - viewport.y, x, y, w, h)) {
      /*let url = window.location.href || document.URL;
      console.log(`Online: ${navigator.onLine} Window URL: ${url}
      Contains lol: ${url.includes("/?=lol")}
      x: ${window.screenX || window.screenLeft}
      y: ${window.screenY || window.screenTop}
      Width: ${window.outerWidth}  Height: ${window.outerHeight}
      Current Minute: ${new Date().getMinutes()}
      `);*/
      tile.setTempImg(this.img2);
    } else {
      tile.setTempImg(this.img1);
    }
    boxes.forEach((box) => {
      if (
        intersects(
          box.x - viewport.x - blockSize / 2,
          box.y - viewport.y - blockSize / 2,
          box.size,
          box.size,
          x,
          y,
          w,
          h
        )
      ) {
        tile.setTempImg(this.img2);
        return;
      }
    });
  }
}

export class setTileButton {
  tileType;
  /**
   *
   * @param {Number} tileType - The type of tile that it will be set to at the metadatas coords
   */
  constructor(tileType) {
    this.tileType = tileType;
  }
  run(tile, x, y, w, h, id, i, j) {
    let postions = mapData[i][j].toString().split("_");

    if (inArea(player.x - viewport.x, player.y - viewport.y, x, y, w, h)) {
      map[postions[0]][postions[1]] = this.tileType;
    }
    boxes.forEach((box) => {
      if (
        intersects(
          box.x - viewport.x - blockSize / 2,
          box.y - viewport.y - blockSize * 10,
          box.size,
          box.size,
          x,
          y,
          w,
          h
        )
      ) {
        map[postions[0]][postions[1]] = this.tileType;
        return;
      }
    });
  }
}

export class SolidPlayerCollider {
  run(tile, x, y, w, h) {
    if (
      inArea(
        player.x - viewport.x,
        player.y - viewport.y + blockSize - 50,
        x,
        y,
        w,
        h
      )
    ) {
      player.pushBackPlayer();
    }
  }
}

export class SolidPlayerColliderNotData {
  id;
  constructor(id) {
    this.id = id;
  }
  run(tile, x, y, w, h, id, i, j) {
    if (
      inArea(
        player.x - viewport.x,
        player.y - viewport.y + blockSize - 50,
        x,
        y,
        w,
        h
      ) &&
      mapData[i][j] != this.id
    ) {
      player.pushBackPlayer();
    }
  }
}

export class animatedTile {
  imgs = [];
  imgon = 0;
  speed = 0;

  ticker = 0;
  constructor() {
    this.speed = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
      const element = arguments[i];
      this.imgs.push(element);
    }
    /*arguments.forEach(element => {
      imgs.push(element);
    });*/
  }
  run(tile, x, y, w, h) {
    if (this.ticker > this.speed) {
      this.imgon++;

      if (this.imgon >= this.imgs.length) {
        this.imgon = 0;
      }

      this.ticker = 0;
    }
    tile.setTempImg(this.imgs[this.imgon]);

    this.ticker++;
  }
}
export class BackgroundTile {
  img;
  constructor(img) {
    this.img = img;
  }
  run(tile, x, y, w, h) {
    renderImage(this.img, x, y, w, h);
  }
}

export class ConnectedTextureComponent {
  img;
  constructor(img) {
    this.img = img;
  }

  run(tile, x, y, w, h, id, i, j) {
    try {
      if (map[i + 1][j] == id && map[i][j + 1] == id) {
        cropImage(this.img, x, y, w, h, 0, 4 * 16, 16, 16);
      } else if (map[i + 1][j] == id && map[i][j - 1] == id) {
        cropImage(this.img, x, y, w, h, 0, 5 * 16, 16, 16);
      } else if (map[i][j - 1] == id && map[i - 1][j] == id) {
        cropImage(this.img, x, y, w, h, 0, 2 * 16, 16, 16);
      } else if (map[i][j + 1] == id && map[i - 1][j] == id) {
        cropImage(this.img, x, y, w, h, 0, 3 * 16, 16, 16);
      } else if (map[i + 1][j] == id || map[i - 1][j] == id) {
        cropImage(this.img, x, y, w, h, 0, 0, 16, 16);
      } /* if(map[i][j + 1] == id && map[i][j - 1] == id)*/ else {
        cropImage(this.img, x, y, w, h, 0, 16, 16, 16);
      }
    } catch (error) {}
  }
}

export class SpecifiedConnectedTextureComponent {
  img;
  id;
  constructor(img, id) {
    this.img = img;
    this.id = id;
  }

  run(tile, x, y, w, h, id, i, j) {
    try {
      if (map[i + 1][j] == this.id && map[i][j + 1] == this.id) {
        cropImage(this.img, x, y, w, h, 0, 4 * 16, 16, 16);
      } else if (map[i + 1][j] == this.id && map[i][j - 1] == id) {
        cropImage(this.img, x, y, w, h, 0, 5 * 16, 16, 16);
      } else if (map[i][j - 1] == this.id && map[i - 1][j] == this.id) {
        cropImage(this.img, x, y, w, h, 0, 2 * 16, 16, 16);
      } else if (map[i][j + 1] == this.id && map[i - 1][j] == this.id) {
        cropImage(this.img, x, y, w, h, 0, 3 * 16, 16, 16);
      } else if (map[i + 1][j] == this.id || map[i - 1][j] == this.id) {
        cropImage(this.img, x, y, w, h, 0, 0, 16, 16);
      } /* if(map[i][j + 1] == id && map[i][j - 1] == id)*/ else {
        cropImage(this.img, x, y, w, h, 0, 16, 16, 16);
      }
    } catch (error) {}
  }
}

export class runIfMetadata {
  components = [];
  states = [];
  constructor() {}

  run(tile, x, y, w, h, id, i, j) {
    for (let i = 0; i < this.components.length; i++) {
      if (this.states[i]) this.components[i].run(tile, x, y, w, h, id, i, j);
    }
  }
  addComponent(c, state) {
    this.components.push(c);
    this.states.push(state);
    return this;
  }
}
var smoke = new ParticleSystem(100, 600, 3, 10, -4, -2, -4, 4);
smoke.setSize(5, 5);
smoke.addRenderer(
  new DefaultSquareParticleRendererRotate("rgba(155,155,155,0.8)", 10)
);
smoke.addUpdaters(new GravityUpdater(-0.2, -3));

var portalFog = new ParticleSystem(100, 600, 5, 10, -4, 4, -4, 4);
portalFog.setSize(10, 10);
portalFog.addRenderer(
  new DefaultSquareParticleRendererRotate("rgba(200,10,200,0.4)", 10)
);

export class AnimationComponent {
  img;
  frames;
  looping = false;
  animationTimer = 20;
  active = true;
  trigger = () => {
    return true;
  };
  constructor(img, frames) {
    this.img = img;
    this.frames = frames;
    //this.frames = img.width / 16;
  }

  run(tile, x, y, w, h, id, i, j) {
    if (this.active) {
      if (this.trigger()) {
        let offset = this.looping ? 0 : 1;
        if (mapData[i][j] < this.frames - offset) {
          if (game.frameNo % this.animationTimer == 0) mapData[i][j]++;
          if (id == 4 || id == 7) {
            smoke.run(x, y + blockSize / 2);
            smoke.run(x + blockSize, y + blockSize / 2);
          } else if (id == 5) {
            portalFog.run(x + blockSize / 2, y + blockSize / 2);
          }
        }
        if (this.looping && mapData[i][j] > this.frames - 1) mapData[i][j] = 0;
      }

      cropImage(this.img, x, y, w, h, mapData[i][j] * 16, 0, 16, 16);
    }
  }
  setCondition(trigger) {
    this.trigger = trigger;
    return this;
  }
  setLooping(l) {
    this.looping = l;
    return this;
  }
  setTimeWait(t) {
    animationTimer = t;
    return this;
  }
  setActive(a) {
    active = a;
    return this;
  }
}

export class nextlevelTeleporter {
  constructor() {}
  run(tile, x, y, w, h, id, i, j) {
    if (
      intersects(
        player.x - viewport.x - blockSize / 2,
        player.y - viewport.y - blockSize / 2,
        blockSize,
        blockSize,
        x,
        y,
        w,
        h
      ) &&
      levelPresense != "pass"
    ) {
      if (offline) {
        /*Speak(
          "???",
          "The level printer cant recive the next level without access to the internet...."
        );*/
      } else {
        //console.log(getLevelPath(levelOn)());

        setLevelPresense("pass");
        resetDelay();
        resetSpeachOn();
        //(levelOn + 1);
        //setLoadingLevel(true);
        //loadWorld(getLevelPath(levelOn)());
      }
    }
  }
}

export class TextPlayerCollider {
  run(tile, x, y, w, h, id, i, j) {
    if (
      inArea(
        player.x - viewport.x,
        player.y - viewport.y + blockSize - 50,
        x,
        y,
        w,
        h
      )
    ) {
      setDisplayText(mapData[i][j].split("_").join(" "));
    }
  }
}

/*export class wireComponent {
  img;
  constructor(img) {
    this.img = img;
  }

  run(tile, x, y, w, h, id, i, j) {
    let xOffset = 0;
    try {
      xOffset = mapData[i][j].split(" ")[2] == 1 ? 16 : 0;
    } catch (err) {}
    try {
      if (map[i + 1][j] == id && map[i][j + 1] == id) {
        cropImage(this.img, x, y, w, h, xOffset, 4 * 16, 16, 16);
      } else if (map[i + 1][j] == id && map[i][j - 1] == id) {
        cropImage(this.img, x, y, w, h, xOffset, 5 * 16, 16, 16);
      } else if (map[i][j - 1] == id && map[i - 1][j] == id) {
        cropImage(this.img, x, y, w, h, xOffset, 2 * 16, 16, 16);
      } else if (map[i][j + 1] == id && map[i - 1][j] == id) {
        cropImage(this.img, x, y, w, h, xOffset, 3 * 16, 16, 16);
      } else if (map[i + 1][j] == id || map[i - 1][j] == id) {
        cropImage(this.img, x, y, w, h, xOffset, 0, 16, 16);
      } // if(map[i][j + 1] == id && map[i][j - 1] == id)
       else {
        cropImage(this.img, x, y, w, h, xOffset, 16, 16, 16);
      }
    } catch (err) {}
  }
}

export class WireActivatorPlayerCollider {
  run(tile, x, y, w, h, id, i, j) {
    if (
      inArea(
        player.x - viewport.x,
        player.y - viewport.y + blockSize - 30,
        x,
        y,
        w,
        h
      )
    ) {

    }


  }
}
*/
export class clickerTile {
  func;
  resetpoint;
  ticker = 0;
  constructor(func, resetpoint) {
    this.func = func;
    this.resetpoint = resetpoint;
  }
  run(tile, x, y, w, h, id, i, j) {
    this.func(parseInt(mapData[i][j]), x, y, w, h);
    if (mousePressed && inArea(mouseX, mouseY, x, y, w, h)) {
      mapData[i][j] = parseInt(mapData[i][j]) + 1;
      if (parseInt(mapData[i][j]) > this.resetpoint - 1) {
        mapData[i][j] = 0;
      }
    }
  }
}
