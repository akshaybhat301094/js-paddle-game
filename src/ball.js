import { detectCollision } from '/src/collisionDetection.js';

export default class Ball {
  constructor(game) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    this.image = document.getElementById('img_ball');

    this.game = game;

    this.size = 16;
    this.reset();
  }

  reset() {
    this.speed = { x: 4, y: -2 };
    this.position = { x: 10, y: 400 };
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }

  update(deltaTime) {
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    // wall on the left and right
    if (this.position.x + this.size > this.gameWidth || this.position.x < 0) {
      this.speed.x = -this.speed.x;
    }

    // wall on top
    if (this.position.y < 0) {
      this.speed.y = -this.speed.y;
    }

    // bottom of game
    if (this.position.y + this.size > this.gameHeight) {
      this.game.lives--;
      this.reset();
    }

    if (detectCollision(this, this.game.paddle)) {
      this.speed.y = -this.speed.y;
      this.position.y = this.game.paddle.position.y - this.size;
    }
  }
}
