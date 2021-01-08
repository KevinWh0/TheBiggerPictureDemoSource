import {
  blockSize,
  mapHeight,
  mapWidth,
  playerImg,
  viewport,
} from "./assetManager.js";
import {
  controls,
  cropImage,
  fill,
  game,
  height,
  inArea,
  keyDown,
  keyPressed,
  keys,
  offsetVibX,
  offsetVibY,
  rect,
  renderImage,
  width,
} from "./toolbox.js";

export class Player {
  x = 0;
  y = 0;
  lastX = 0;
  lastY = 0;
  face = "Right";

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  render() {
    /*fill("green");
    rect(
      this.x - viewport.x + width / 2 - blockSize / 2,
      this.y - viewport.y + height / 2 - blockSize / 2,
      blockSize,
      blockSize
    );*/
    /*renderImage(
      playerImg.right,
      this.x - viewport.x - blockSize / 2 + offsetVibX,
      this.y - viewport.y - blockSize / 2 + offsetVibY,
      blockSize,
      blockSize
    );*/

    if (keyDown) {
      cropImage(
        playerImg[`player${this.face}Run`],
        this.x - viewport.x - blockSize / 2 + offsetVibX,
        this.y - viewport.y - blockSize / 2 + offsetVibY,
        blockSize,
        blockSize,
        (Math.round(game.frameNo / 6) % (playerImg.playerRightRun.width / 16)) *
          16,
        0,
        16,
        16
      );
    } else {
      renderImage(
        playerImg[this.face],
        this.x - viewport.x - blockSize / 2 + offsetVibX,
        this.y - viewport.y - blockSize / 2 + offsetVibY,
        blockSize,
        blockSize
      );
    }
  }

  update() {
    //check wasd
    this.lastX = this.x;
    this.lastY = this.y;
    if (
      keys[controls[0][0]] ||
      keys[controls[0][1]] ||
      keys[controls[0][2]] ||
      keys[controls[0][3]] ||
      keys[controls[1][0]] ||
      keys[controls[1][1]] ||
      keys[controls[1][2]] ||
      keys[controls[1][3]]
    ) {
      if (keys[controls[0][0]] || keys[controls[1][0]]) {
        this.yVel = -1;
        this.y -= 10;
        this.face = "Up";
      }
      if (keys[controls[0][1]] || keys[controls[1][1]]) {
        this.xVel = -1;
        this.x -= 10;
        this.face = "Left";
      }
      if (keys[controls[0][2]] || keys[controls[1][2]]) {
        this.yVel = 1;
        this.y += 10;
        this.face = "Left";
      }
      if (keys[controls[0][3]] || keys[controls[1][3]]) {
        this.xVel = 1;
        this.x += 10;
        this.face = "Right";
      }
    } else {
      this.xVel = 0;
      this.yVel = 0;
    }
    if (
      !inArea(this.x, this.y, 0, 0, mapWidth * blockSize, mapHeight * blockSize)
    ) {
      this.pushBackPlayer();
    }
  }

  pushBackPlayer() {
    this.x = this.lastX;
    this.y = this.lastY;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}
