class Game {
  constructor() {
    this.gameRunning = false;
    this.score = 0;
    this.viewportOffset = 0;
    this.gravity = 0.5;

    this.gameContainer = null;
    this.gameScreen = null;
    this.player = null;
    this.platformManager = null;
    this.ui = null;
  }

  init() {
    this.gameContainer = document.getElementById("game-container");
    this.gameScreen = document.getElementById("game-screen");

    this.ui = new UI(this);
    this.platformManager = new PlatformManager(this);

    this.player = new Player(
      this.gameContainer.offsetWidth / 2 - 15,
      this.gameContainer.offsetHeight - 100,
      30,
      30,
      this
    );

    this.ui.updateScore();
    this.platformManager.createInitialPlatforms();

    this.gameRunning = true;
    this.gameLoop();
  }

  gameLoop() {
    if (!this.gameRunning) return;

    this.player.update();
    this.platformManager.updatePlatforms();
    this.platformManager.checkCollisions(this.player);

    requestAnimationFrame(() => this.gameLoop());
  }

  increaseScore(points) {
    this.score += points;
    this.ui.updateScore();
  }

  gameOver() {
    this.gameRunning = false;
    this.ui.showGameOver(this.score);

    this.player.x = this.gameContainer.offsetWidth / 2 - this.player.width / 2;
    this.player.y = this.gameContainer.offsetHeight - 100;
    this.player.moveY = 0;
    this.player.moveX = 0;
    this.player.updatePosition();

    const highScore = localStorage.getItem("highScore") || 0;
    if (this.score > highScore) {
      //maybe add an animation here
      this.ui.finalScoreElement.textContent =
        "New High Score: " + Math.floor(this.score);
      localStorage.setItem("highScore", Math.floor(this.score));
    }
  }

  restart() {
    this.score = 0;
    this.ui.updateScore();

    this.platformManager.resetPlatforms();

    this.gameRunning = true;
    this.gameLoop();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();

  const menuContainer = document.getElementById("menu-container");
  const gameContainer = document.getElementById("game-container");
  const startButton = document.getElementById("start-button");

  startButton.addEventListener("click", function () {
    menuContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    game.init();
  });
});
