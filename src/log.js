"use strict";

/**
 * @module exports the Log class
 */
module.exports = exports = Log;

const MOVE_SPEED = 8;

function Log(x, y, direction) {
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.width = 64;
  this.height = 192;
  this.spritesheet = new Image();
  this.spritesheet.src = 'assets/log.png';
}

Log.prototype.update = function () {
  this.y += this.direction * MOVE_SPEED / 8;
}

Log.prototype.render = function (ctx) {
  ctx.drawImage(this.spritesheet, 0, 0, 64, 192, this.x, this.y, this.width, this.height);
}

