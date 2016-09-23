"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Mini = require('./mini.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({ x: 0, y: 240 });
var lanes = [[144, 192, 336, 384], [480, 528, 576, 624]];
var level = 1;
var obstacles = [new Mini(144, -128, 1), new Mini(192, 380, 1), new Mini(336, 240, -1), new Mini(384, 600, -1)];

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
  for (var i = 0; i < obstacles.length; i++) {
    var obs = obstacles[i];
    updateObstacle(obs);
    if (obs.x == player.x && !(obs.y + obs.height < player.y || obs.y > player.y + player.height)) die();
  }
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

function updateObstacle(obs) {
  obs.update();
  if (obs.y < 0 - obs.height && obs.direction < 0) obs.y = rollRandom(canvas.height + obs.height, canvas.height + obs.height * 5);
  else if (obs.y > canvas.height + obs.height && obs.direction > 0) obs.y = rollRandom(-(obs.height * 5), 0 - obs.height);
}

function die() {

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

