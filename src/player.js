"use strict";

const MS_PER_FRAME = 1000 / 8;
const MOVE_SPEED = 16;

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
  this.frame = 10;
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
    // TODO: Implement your player's update by state

    case "moving":
      // TODO > properly sync animation
      this.timer += time;
      if (this.timer > MS_PER_FRAME) { // TODO > update pos separate from animation? 2 frames per pos update?
        this.frame += 1;
		if(this.frame < 3){
		  this.x += (this.targetx - this.x)/4;
		  this.y += (this.targety - this.y)/4;
		} else {
		  this.state = "idle";
          this.frame = 10;
		}
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
        this.frame * 64, (this.frame % 10) * 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    // TODO: Implement your player's redering according to state

    // TODO > is this even necessary?
    // case "moving":

    //   break;
  }
}

Player.prototype.move = function (position) {
  if (this.state == "idle") {
    this.state = "moving";
    this.targetx = position.x;
    this.targety = position.y;
    this.frame = -1; // -1 so animation starts on next update() correctly. -1++ = 0
  }
}