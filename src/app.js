"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({ x: 0, y: 240 });

var background = new Image();
background.src = encodeURI('assets/background.png');

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function (timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.drawImage(background, 0, 0, background.width, background.height);
  player.render(elapsedTime, ctx);
}

window.onkeydown = function (event) {
  switch (event.keyCode) {
    // UP
    case 38:
    case 87:
      event.preventDefault();
      if (!game.paused) {
        player.move(0, -1);
      }
      break;

    // Left
    case 37:
    case 65:
      event.preventDefault();
      if (!game.paused) {
        player.move(-1, 0);
      }
      break;

    // Down
    case 40:
    case 83:
      event.preventDefault();
      if (!game.paused) {
        player.move(0, 1);
      }
      break;

    // Right
    case 39:
    case 68:
      event.preventDefault();
      if (!game.paused) {
        player.move(1, 0);
      }
      break;

  }
}
