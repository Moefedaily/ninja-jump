class PlatformManager {
  constructor(game) {
    this.game = game;
    this.platforms = [];
  }

  createInitialPlatforms() {
    // First platform is always normal
    this.platforms.push(
      new Platform(
        this.game.gameContainer.offsetWidth / 2 - 50,
        this.game.gameContainer.offsetHeight - 50,
        100,
        20,
        "normal",
        this.game
      )
    );

    // Create rest of initial platforms
    for (let i = 0; i < 10; i++) {
      let x = Math.random() * (this.game.gameContainer.offsetWidth - 100);
      let y = this.game.gameContainer.offsetHeight - 150 - i * 80;
      let type = this.getRandomPlatformType();

      this.platforms.push(new Platform(x, y, 100, 30, type, this.game));
    }
  }

  getRandomPlatformType() {
    const random = Math.random();
    if (random < 0.1) return "spring";
    if (random < 0.3) return "moving";
    return "normal";
  }

  updatePlatforms() {
    // Update platform movements
    this.platforms.forEach((platform) => {
      platform.updateMovement();
    });

    // Check for platforms that have moved off-screen
    for (let i = 0; i < this.platforms.length; i++) {
      const platform = this.platforms[i];

      if (platform.y > this.game.gameContainer.offsetHeight) {
        // Find the highest platform (lowest y value)
        let highestPlatform = this.platforms.reduce(
          (highest, p) => (p.y < highest ? p.y : highest),
          this.game.gameContainer.offsetHeight
        );

        // Calculate new position with smarter horizontal distribution
        const containerWidth = this.game.gameContainer.offsetWidth;
        let newX;

        // Divide screen into thirds and use weighted positioning
        const screenSection = Math.random();
        if (screenSection < 0.4) {
          // Left third of screen (40% chance)
          newX = Math.random() * (containerWidth / 3);
        } else if (screenSection < 0.8) {
          // Right third of screen (40% chance)
          newX =
            (containerWidth * 2) / 3 +
            Math.random() * (containerWidth / 3) -
            100;
        } else {
          // Middle of screen (20% chance)
          newX = containerWidth / 3 + Math.random() * (containerWidth / 3);
        }

        // Make sure platform isn't too close to edge
        newX = Math.max(0, Math.min(newX, containerWidth - 100));

        let newY = highestPlatform - 90;
        let newType = this.getRandomPlatformType();

        // Update existing platform
        platform.x = newX;
        platform.y = newY;

        // Update type if needed
        if (platform.type !== newType) {
          platform.type = newType;
          platform.isMoving = newType === "moving";
          platform.isSpring = newType === "spring";
          platform.platformDiv.className = "platform platform-" + newType;
          platform.platformDiv.style.backgroundImage = `url('./assets/platform-${newType}.png')`;
        }

        platform.updatePosition();
      }
    }

    // Add new platforms if needed (only if somehow we have fewer than 10)
    while (this.platforms.length < 10) {
      // Apply the same smarter horizontal distribution for new platforms
      const containerWidth = this.game.gameContainer.offsetWidth;
      let x;

      // Divide screen into thirds and use weighted positioning
      const screenSection = Math.random();
      if (screenSection < 0.4) {
        // Left third of screen (40% chance)
        x = Math.random() * (containerWidth / 3);
      } else if (screenSection < 0.8) {
        // Right third of screen (40% chance)
        x =
          (containerWidth * 2) / 3 + Math.random() * (containerWidth / 3) - 100;
      } else {
        // Middle of screen (20% chance)
        x = containerWidth / 3 + Math.random() * (containerWidth / 3);
      }

      // Make sure platform isn't too close to edge
      x = Math.max(0, Math.min(x, containerWidth - 100));

      let highestPlatform = this.platforms.reduce(
        (highest, platform) => (platform.y < highest ? platform.y : highest),
        this.game.gameContainer.offsetHeight
      );
      let y = highestPlatform - 90;
      let type = this.getRandomPlatformType();
      this.platforms.push(new Platform(x, y, 100, 30, type, this.game));
    }
  }

  scrollPlatformsDown(amount) {
    this.platforms.forEach((platform) => {
      platform.y += amount;
      platform.updatePosition();
    });
  }

  checkCollisions(player) {
    if (player.moveY > 0) {
      const playerRect = player.PlayerDiv.getBoundingClientRect();

      this.platforms.forEach((platform) => {
        const platformRect = platform.platformDiv.getBoundingClientRect();

        if (
          playerRect.right > platformRect.left &&
          playerRect.left < platformRect.right &&
          playerRect.bottom > platformRect.top &&
          playerRect.bottom - player.moveY <= platformRect.top
        ) {
          player.y = platform.y - player.height;

          if (platform.type === "spring") {
            player.springJump();
          } else {
            player.jump();
          }
        }
      });
    }
  }

  resetPlatforms() {
    this.platforms.forEach((platform) => platform.remove());
    this.platforms = [];

    this.createInitialPlatforms();
  }
}
