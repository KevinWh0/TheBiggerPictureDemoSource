import { player } from "./assetManager.js";
import { height, width } from "./toolbox.js";

export class Viewport {
  x;
  y;
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  update() {
    this.x = player.x - width / 2;
    this.y = player.y - height / 2;
  }
}
