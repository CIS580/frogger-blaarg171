"use strict";

/**
 * @module exports the Mini class
 */
module.exports = exports = Mini;

function Mini(x, y, direction) {
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.width = 64;
  this.height = 64;
  this.speed = 8;
  this.speedBase = 8;
  this.spritesheet = new Image();
  this.spritesheet.src = 'assets/cars_mini.svg';
}

Mini.prototype.update = function () {
  this.y += this.direction * this.speed / 8;
}

Mini.prototype.render = function (ctx) {
  ctx.drawImage(this.spritesheet, 0, 0, 220, 450, this.x, this.y, this.width, this.height);
}

