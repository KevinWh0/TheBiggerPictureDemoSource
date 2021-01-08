import {
  fill,
  rect,
  removeItem,
  randomNumber,
  saveScreenSettings,
  restoreScreenSettings,
  rotate,
} from "./toolbox.js";

export let particles = [];

export function removeDeadParticles() {}

export class ParticleSystem {
  spawnx;
  spawny;
  minlifetime;
  maxlifetime;
  maxXVelocity;
  maxYVelocity;
  minXVelocity;
  minYVelocity;

  particles = [];
  renderers = [];
  updaters = [];
  constructor(
    spawnx,
    spawny,
    minlifetime,
    maxlifetime,

    minXVelocity,
    maxXVelocity,
    minYVelocity,
    maxYVelocity
  ) {
    this.spawnx = spawnx;
    this.spawny = spawny;
    this.minlifetime = minlifetime;
    this.maxlifetime = maxlifetime;
    this.maxXVelocity = maxXVelocity;
    this.maxYVelocity = maxYVelocity;
    this.minXVelocity = minXVelocity;
    this.minYVelocity = minYVelocity;
    //this.xVelocity = xVelocity;
    //this.yVelocity = yVelocity;
  }

  run(x, y) {
    if (!!y) {
      this.particles.push(
        new Particle(
          x,
          y,
          this.w,
          this.h,
          this.minlifetime,
          this.maxlifetime,
          randomNumber(this.minXVelocity, this.maxXVelocity),
          randomNumber(this.minYVelocity, this.maxYVelocity),
          this.color
        )
      );
    } else {
      this.particles.push(
        new Particle(
          this.spawnx,
          this.spawny,
          this.w,
          this.h,
          this.minlifetime,
          this.maxlifetime,
          randomNumber(this.minXVelocity, this.maxXVelocity),
          randomNumber(this.minYVelocity, this.maxYVelocity),
          this.color
        )
      );
    }

    for (let i = 0; i < this.particles.length; i++) {
      let particle = this.particles[i];
      particle.update(this);
      particle.render(this);
      if (!particle.alive) {
        this.particles = removeItem(this.particles, i);
      }
    }
  }
  addRenderer(r) {
    this.renderers.push(r);
  }
  addUpdaters(u) {
    this.updaters.push(u);
  }
  setSize(w, h) {
    this.w = w;
    this.h = h;
  }
}

class Particle {
  lifetime;
  xVelocity;
  yVelocity;
  color;
  alive = true;
  lifetimeCounter = 0;
  x;
  y;
  w = 4;
  h = 4;

  constructor(
    spawnx,
    spawny,
    w,
    h,
    minlifetime,
    maxlifetime,
    xVelocity,
    yVelocity
  ) {
    this.x = spawnx;
    this.y = spawny;
    this.lifetime = randomNumber(minlifetime, maxlifetime);
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    this.w = w;
    this.h = h;
    //this.color = color;
  }
  render(u) {
    //fill(this.color);
    //rect(this.x, this.y, 5, 5);
    u.renderers.forEach((e) => {
      e.render(this);
    });
  }
  update(r) {
    this.lifetimeCounter++;
    if (this.lifetimeCounter > this.lifetime) {
      this.alive = false;
    }
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    r.updaters.forEach((e) => {
      e.update(this);
    });
  }
}

export class DefaultSquareParticleRenderer {
  color;
  constructor(color) {
    this.color = color;
  }
  render(particle) {
    //console.log(particle);
    fill(this.color);
    rect(particle.x, particle.y, particle.w, particle.h);
  }
}

export class DefaultSquareParticleRendererRotate {
  color;
  speedMultiplyer;
  constructor(color, speedMultiplyer) {
    this.color = color;
    this.speedMultiplyer = speedMultiplyer;
  }
  render(particle) {
    //console.log(particle);
    fill(this.color);
    saveScreenSettings();
    rotate(
      particle.x,
      particle.y,
      particle.lifetimeCounter * this.speedMultiplyer
    );
    rect(-particle.w / 2, -particle.h / 2, particle.w, particle.h);
    restoreScreenSettings();
  }
}

export class GravityUpdater {
  grav;
  maxVel;
  constructor(gravity, maxVel) {
    this.grav = gravity;
    this.maxVel = maxVel;
  }
  update(particle) {
    //if (particle.yVelocity >= this.maxVel)
    particle.yVelocity -= this.grav;
  }
}
