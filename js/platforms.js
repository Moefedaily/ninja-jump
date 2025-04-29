class Platform {
  constructor(x, y, width, height, type = "normal", game) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.game = game;

    this.isMoving = type === "moving";
    this.moveSpeed = 1;
    this.moveDirection = Math.random() < 0.5 ? -1 : 1;

    this.platformDiv = document.createElement("div");
    this.platformDiv.className = "platform platform-" + type;
    this.platformDiv.style.width = width + "px";
    this.platformDiv.style.height = height + "px";
    this.platformDiv.style.left = x + "px";
    this.platformDiv.style.top = y + "px";

    this.platformDiv.style.backgroundImage = `url('./assets/platform-${type}.png')`;

    if (type === "spring") {
      this.springElement = document.createElement("div");
      this.springElement.className = "spring";
      this.springElement.style.left = width / 2 - 10 + "px";
      this.springElement.style.top = "-10px";
      this.element.appendChild(this.springElement);
    }

    game.gameScreen.appendChild(this.platformDiv);
  }

  updatePosition() {
    this.platformDiv.style.left = this.x + "px";
    this.platformDiv.style.top = this.y + "px";
  }

  remove() {
    this.platformDiv.remove();
  }

  updateMovement() {
    if (this.isMoving) {
      this.x += this.moveSpeed * this.moveDirection;

      if (this.x <= 0) {
        this.moveDirection = 1;
      } else if (this.x + this.width >= this.game.gameContainer.offsetWidth) {
        this.moveDirection = -1;
      }

      this.updatePosition();
    }
  }
}
