import { blockSize, player, tiles, viewport } from "./assetManager.js";
import {
  fill,
  game,
  height,
  intersects,
  loadImg,
  rect,
  renderImage,
  width,
} from "./toolbox.js";

export class pushableBox {
  x;
  y;
  size = blockSize;
  img;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  runBox() {
    if (
      intersects(
        this.x,
        this.y,
        this.size,
        this.size,
        player.x,
        player.y,
        blockSize,
        blockSize
      )
    ) {
      this.x += player.x - player.lastX;
      this.y += player.y - player.lastY;
    }

    renderImage(
      tiles.crate,
      this.x - viewport.x - blockSize / 2,
      this.y - viewport.y - blockSize / 2,
      this.size,
      this.size
    );
  }
}
