"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Mini = require('./mini.js');
const Log = require('./log.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({ x: 0, y: 240 });
var lanes = [[144, 192, 336, 384], [480, 528, 576, 624]];
var level = 1;
var obstacles = {
  minis: [new Mini(144, -128, 1), new Mini(144, 300, 1), new Mini(192, 380, 1), new Mini(192, -200, 1), new Mini(336, 240, -1), new Mini(336, 600, -1), new Mini(384, 600, -1), new Mini(384, 20, -1)],
  logs: [new Log(480, 0, 1), new Log(480, 240, 1), new Log(528, -200, -1), new Log(528, 200, -1), new Log(576, 240, 1), new Log(576, 600, 1), new Log(624, 240, -1), new Log(624, 30, -1)]
};

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

  for (var i = 0; i < obstacles.minis.length; i++) {
    var mini = obstacles.minis[i];
    mini.speed = level * mini.speedBase;
    updateObstacle(mini);
    if (player.x >= 144 && player.x < 448) {
      if (mini.x == player.x && !(mini.y + mini.height < player.y || mini.y > player.y + player.height)) player.state = "dead";
    }
  }

  for (var i = 0; i < obstacles.logs.length; i++) {
    var log = obstacles.logs[i];
    updateObstacle(log);
    if (log.x == player.x && !(log.y + log.height < player.y || log.y > player.y + player.height))
      player.onLog = true;
  }

  if (player.x >= 480 && player.x < 688 && !player.onLog)
    player.state = "dead";
  else
    player.onLog = false;

  if (player.x >= 720) {
    player.x = 0;
    player.y = 240;
    level++;
  }

  document.getElementById("lives").innerHTML = player.lives;
  document.getElementById("level").innerHTML = level;
  if (player.lives <= 0) game.lose();
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
  for (var i = 0; i < obstacles.minis.length; i++) {
    obstacles.minis[i].render(ctx);
  }
  for (var i = 0; i < obstacles.logs.length; i++) {
    obstacles.logs[i].render(ctx);
  }
  player.render(elapsedTime, ctx);
}

function updateObstacle(obs) {
  obs.update();
  if (obs.y < 0 - obs.height && obs.direction < 0) obs.y = rollRandom(canvas.height, canvas.height + 64 * 10);
  else if (obs.y > canvas.height + obs.height && obs.direction > 0) obs.y = rollRandom(-(64 * 10), 0 - 64);
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

