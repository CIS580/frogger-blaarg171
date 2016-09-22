"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Mini = require('./mini.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({ x: 0, y: 240 });
var obstacles = [];
var lanes = [[144, 192, 336, 384], [480, 528, 576, 624]];
var level = 1;

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
  spawnObstacles();
  updateObstacles();
  document.getElementById("lives").innerHTML = player.lives;
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
  for (var i = 0; i < obstacles.length; i++) {
    obstacles[i].render(ctx);
  }
}

function spawnObstacles() {

  // Spawn Minis
  if (obstacles.length < 4) {
    for (var d = 1; d <= level; d++) {
      for (var l = 0; l < lanes[0].length; l++) {
        obstacles.push(new Mini(lanes[0][l], rollRandom(-64, 640), (l > 1) ? -1 : 1));
      }
    }
  }


}

function updateObstacles() {
  for (var i = 0; i < obstacles.length; i++) {
    obstacles[i].update();
    if (obstacles[i].y > canvas.height + obstacles[i].height ||
      obstacles[i].y < 0 + obstacles[i].height) obstacles.splice(i--, 1);
  }
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

function rollRandom(aMinimum, aMaximum) {
  return Math.floor(Math.random() * (aMaximum - aMinimum) + aMinimum);
}

