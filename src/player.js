"use strict";

const MS_PER_FRAME = 1000 / 8;
const MOVE_SPEED = 64;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.targetx = position.x;
  this.targety = position.y;
  this.width = 64;
  this.height = 64;
  this.spritesheet = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.timer = 0;
  this.onLog = false;
  this.frame = 10;
  this.lives = 3;
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function (time) {
  switch (this.state) {
    case "idle":
      this.timer += time;
      if (this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if (this.frame > 13) this.frame = 10;
      }
      break;

    case "moving":
      this.timer += time;
      if (this.timer > MS_PER_FRAME) { // TODO > update pos separate from animation? 2 frames per pos update?
        this.frame += 1;
        if (this.frame < 3) {
          this.x += this.targetx * MOVE_SPEED / 4;
          this.y += this.targety * MOVE_SPEED / 4;
        } else if (this.frame >= 4) {
          this.state = "idle";
          this.frame = 10;
        }
      }
      break;

    case "dead":
      this.timer += time;
      if (this.timer > MS_PER_FRAME * 4) {
        this.lives--;
        this.timer = 0;
        this.x = 0;
        this.y = 240;
        this.state = "idle";
        this.frame = 10;
        this.onLog = false;
      }
      break;
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function (time, ctx) {
  switch (this.state) {
    case "idle":
    case 'moving': // TODO > jumping backwards animation?
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        Math.max(this.frame - 10, 0) * 64, Math.floor(this.frame / 10) * 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    // TODO: Implement your player's redering according to state

    case "dead":
      break;
  }
}

Player.prototype.move = function (x, y) {
  if (this.state == "idle") {
    this.state = "moving";
    this.targetx = x;
    this.targety = y;
    this.frame = -1; // -1 so animation starts on next update() correctly. -1++ = 0
  }
}

