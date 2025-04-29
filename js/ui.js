class UI {
  constructor(game) {
    this.game = game;
    this.scoreElement = document.getElementById("score");
    this.gameOverElement = document.getElementById("game-over");
    this.finalScoreElement = this.gameOverElement.querySelector(".final-score");
    this.restartButton = document.getElementById("restart-button");

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.restartButton.addEventListener("click", () => {
      this.hideGameOver();
      this.game.restart();
    });
  }

  updateScore() {
    this.scoreElement.textContent = Math.floor(this.game.score);
  }

  showGameOver(score) {
    this.finalScoreElement.textContent = "Score: " + Math.floor(score);
    this.gameOverElement.classList.remove("hidden");
  }

  hideGameOver() {
    this.gameOverElement.classList.add("hidden");
  }
}
