import Paddle from '/src/paddle.js';
import InputHandler from '/src/input.js';
import Ball from '/src/ball.js';
import { buildLevel, level1, level2 } from '/src/levels.js';

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4,
};

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gameState = GAMESTATE.MENU;

    this.paddle = new Paddle(this);
    this.ball = new Ball(this);
    new InputHandler(this.paddle, this);

    this.bricks = [];
    this.gameObjects = [];
    this.lives = 3;

    this.levels = [level1, level2];
    this.currentLevel = 0;
  }

  start() {
    if (
      this.gameState !== GAMESTATE.MENU &&
      this.gameState === GAMESTATE.NEWLEVEL
    )
      return;
    this.bricks = buildLevel(this, this.levels[this.currentLevel]);
    this.ball.reset();
    this.gameObjects = [this.ball, this.paddle];
    this.gameState = GAMESTATE.RUNNING;
  }

  update(deltaTime) {
    if (this.lives === 0) this.gameState = GAMESTATE.GAMEOVER;

    if (
      this.gameState === GAMESTATE.PAUSED ||
      this.gameState === GAMESTATE.MENU ||
      this.gameState === GAMESTATE.GAMEOVER
    )
      return;

    if (this.bricks.length === 0) {
      this.currentLevel++;
      this.start();
      this.gameState = GAMESTATE.NEWLEVEL;
    }

    [...this.gameObjects, ...this.bricks].forEach((obj) =>
      obj.update(deltaTime)
    );

    this.bricks = this.bricks.filter((brick) => !brick.markedForDeletion);
  }

  draw(ctx) {
    [...this.gameObjects, ...this.bricks].forEach((obj) => obj.draw(ctx));

    if (this.gameState == GAMESTATE.PAUSED) {
      this.drawState(ctx, 'Paused', 'rgba(0,0,0,0.5)');
    }

    if (this.gameState == GAMESTATE.MENU) {
      this.drawState(ctx, 'Press SPACEBAR to Start', 'rgba(0,0,0,1)');
    }

    if (this.gameState == GAMESTATE.GAMEOVER) {
      this.drawState(ctx, 'GAME OVER', 'rgba(0,0,0,1)');
    }

    this.drawInfo(ctx);
  }

  drawState(ctx, text, style) {
    ctx.rect(0, 0, this.gameWidth, this.gameHeight);
    ctx.fillStyle = style;
    ctx.fill();

    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(text, this.gameWidth / 2, this.gameHeight / 2);
  }

  drawInfo(ctx) {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fontWeight = 'bold';
    ctx.fillText(`Lives left ${this.lives}`, 720, 40);

    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fontWeight = 'bold';
    ctx.fillText(`Level ${this.currentLevel + 1}`, 80, 40);
  }

  togglePause() {
    if (this.gameState == GAMESTATE.PAUSED) {
      this.gameState = GAMESTATE.RUNNING;
    } else {
      this.gameState = GAMESTATE.PAUSED;
    }
  }
}
