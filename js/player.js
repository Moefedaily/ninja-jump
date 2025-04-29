class Player {
  constructor(x, y, width, height, game) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.moveX = 0;
    this.moveY = 0;
    this.jumpForce = -15;
    this.springJumpForce = -35;
    this.game = game;

    this.facingLeft = false;

    this.PlayerDiv = document.getElementById("player");
    this.image = this.PlayerDiv.querySelector("img");

    this.PlayerDiv.style.width = width + "px";
    this.PlayerDiv.style.height = height + "px";
    this.updatePosition();

    this.keys = {};
    this.setupInputHandlers();
  }

  setupInputHandlers() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });
    this.setupMobileControls();
  }

  setupMobileControls() {
    const leftBtn = document.getElementById("btn-left");
    const rightBtn = document.getElementById("btn-right");
    const mobileControls = document.getElementById("mobile-controls");

    // Check if mobile controls exist in DOM

    // Check BOTH screen size AND touch capability
    const isSmallScreen = window.innerWidth <= 768;
    const hasTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;

    // Only show controls if BOTH conditions are true
    if (isSmallScreen && hasTouch) {
      // Small touch screen - show controls
      mobileControls.style.display = "flex";

      // Set up touch event listeners
      leftBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.keys["ArrowLeft"] = true;
        this.keys["ArrowRight"] = false;
      });

      leftBtn.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.keys["ArrowLeft"] = false;
      });

      rightBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.keys["ArrowRight"] = true;
        this.keys["ArrowLeft"] = false;
      });

      rightBtn.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.keys["ArrowRight"] = false;
      });
    } else {
      // Either large screen OR no touch - hide controls
      mobileControls.style.display = "none";
    }
  }

  handleInput() {
    if (this.keys["ArrowLeft"]) {
      this.moveX = -3;
    } else if (this.keys["ArrowRight"]) {
      this.moveX = 3;
    } else {
      this.moveX = 0;
    }
  }

  updatePosition() {
    this.PlayerDiv.style.left = this.x + "px";
    this.PlayerDiv.style.top = this.y + "px";
  }

  update() {
    this.handleInput();

    this.moveY += this.game.gravity;
    this.x += this.moveX;
    this.y += this.moveY;

    if (this.moveX < 0) {
      this.image.src = `./assets/doodleLeft.png`;
    } else if (this.moveX > 0) {
      this.image.src = `./assets/doodle.png`;
    }
    // for not going off screen horizontally
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.width > this.game.gameContainer.offsetWidth) {
      this.x = this.game.gameContainer.offsetWidth - this.width;
    }

    // scroll the viewport
    if (this.y < this.game.gameContainer.offsetHeight / 2 && this.moveY < 0) {
      this.game.viewportOffset -= this.moveY;
      this.y -= this.moveY;

      // move platforms down
      this.game.platformManager.scrollPlatformsDown(-this.moveY);

      // increase score
      this.game.increaseScore(-this.moveY);
    }

    // check if player fell off
    if (this.y > this.game.gameContainer.offsetHeight) {
      this.game.gameOver();
    }

    this.updatePosition();
  }

  jump() {
    this.moveY = this.jumpForce;
  }

  springJump() {
    this.moveY = this.springJumpForce;
  }
}
