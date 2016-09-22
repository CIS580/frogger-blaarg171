"use strict";

/**
 * @module exports the Mini class
 */
module.exports = exports = Mini;

const MOVE_SPEED = 32;

function Mini(x, y, direction) {
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.width = 64;
  this.height = 64;
  this.spritesheet = new Image();
  this.spritesheet.src = 'assets/cars_mini.svg';
}

Mini.prototype.update = function () {
  this.y += this.direction * MOVE_SPEED / 8;
}

Mini.prototype.render = function (ctx) {
  ctx.drawImage(this.spritesheet, 0, 0, 220, 450, this.x, this.y, this.width, this.height);
}