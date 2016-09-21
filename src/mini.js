"use strict";

/**
 * @module exports the Mini class
 */
module.exports = exports = Mini;

const MOVE_SPEED = 1;

function Mini(position) {
  this.x = position.x;
  this.y = position.y;
  this.width = 128;
  this.height = 192;
  this.spritesheet = new Image();
  this.spritesheet.src = 'assets/cars_mini.svg';
}

Mini.prototype.update = function () {

}

Mini.prototype.render = function (ctx) {

}