class Player {
  constructor(x, y, width, height, game) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.moveX = 0;
    this.moveY = 0;
    this.jumpForce = -15;
    this.springJumpForce = -40; // Higher jump for spring platforms
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

    // Check if mobile controls are present
    if (!leftBtn || !rightBtn) return;

    // Left button touch events
    leftBtn.addEventListener("touchstart", () => {
      this.keys["ArrowLeft"] = true;
      this.keys["ArrowRight"] = false; // Ensure only one direction at a time
    });

    leftBtn.addEventListener("touchend", () => {
      this.keys["ArrowLeft"] = false;
    });

    // Right button touch events
    rightBtn.addEventListener("touchstart", () => {
      this.keys["ArrowRight"] = true;
      this.keys["ArrowLeft"] = false; // Ensure only one direction at a time
    });

    rightBtn.addEventListener("touchend", () => {
      this.keys["ArrowRight"] = false;
    });

    // Prevent default touch behavior (like scrolling)
    const mobileControls = document.getElementById("mobile-controls");
    if (mobileControls) {
      mobileControls.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
        },
        { passive: false }
      );

      mobileControls.addEventListener(
        "touchmove",
        (e) => {
          e.preventDefault();
        },
        { passive: false }
      );
    }

    // Show mobile controls on touch devices
    this.detectTouchDevice();
  }

  detectTouchDevice() {
    // Check if it's a touch device
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;

    // Show mobile controls if it's a touch device
    if (isTouchDevice) {
      const mobileControls = document.getElementById("mobile-controls");
      if (mobileControls) {
        mobileControls.classList.remove("hidden");
      }
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
