(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    updateObstacle(obstacles.logs[i]);
  }
  for (var i = 0; i < obstacles.logs.length; i++) {
    var log = obstacles.logs[i];
    if (log.x == player.x && !(log.y + log.height < player.y || log.y > player.y + player.height))
      player.onLog = true;
    break;
  }

  if (player.x >= 480 && player.x < 688) {
    if (!player.onLog)
      player.state = "dead";
  }
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


},{"./game.js":2,"./log.js":3,"./mini.js":4,"./player.js":5}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function (flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function (newTime) {
  try {
    var game = this;
    var elapsedTime = newTime - this.oldTime;
    this.oldTime = newTime;

    if (!this.paused) this.update(elapsedTime);
    this.render(elapsedTime, this.frontCtx);

    // Flip the back buffer
    this.frontCtx.drawImage(this.backBuffer, 0, 0);
  }
  catch (e) {

  }
}

Game.prototype.lose = function () {
  this.frontCtx.fillStyle = "purple"; // Something clear and obvious besides red since apples are red...
  this.frontCtx.font = "bold 80px Verdana";
  this.frontCtx.textAlign = "center";
  this.frontCtx.textBaseline = "middle";
  this.frontCtx.fillText("GAME OVER", this.backBuffer.width / 2, this.backBuffer.height / 2);
  throw new Error("Lazy terminate...");
}


},{}],3:[function(require,module,exports){
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


},{}],4:[function(require,module,exports){
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


},{}],5:[function(require,module,exports){
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


},{}]},{},[1]);
