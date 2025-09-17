class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro");
    this.gameScreen = document.getElementById("game-screen");
    this.gameEndScreen = document.getElementById("game-end");

    this.player = new Player(
      this.gameScreen,
      200,
      500,
      100,
      150,
      "./assets/hero.png"
    );

    this.height = 600;
    this.width = 500;
    this.obstacles = [];
    this.cookies = []; // cookies array
    this.score = 0;
    this.lives = 3;
    this.maxLives = 3; // change mechanic to max out at 3 lives
    this.gameIsOver = false;
    this.gameIntervalId;
    this.gameLoopFrequency = Math.round(1000 / 60);

    // USE IN CASE I WANT TO INCREASE SPEED DYNAMICALLY

    // this.backgroundSpeed = 6; // pixels per frame (base speed)
    // this.cookieSpeed = 6; // same as background (stationary appearance)
    // this.obstacleSpeed = 3.6; // slower than background (traffic moving in same direction)

    //

    // Get references to the score and lives display elements
    this.scoreElement = document.getElementById("score");
    this.livesElement = document.getElementById("life-slices"); // update to adopt pizza slice lives dynamic
  }

  start() {
    this.gameScreen.style.height = `${this.height}px`;
    this.gameScreen.style.width = `${this.width}px`;

    this.startScreen.style.display = "none";

    this.gameScreen.style.display = "block";

    document.getElementById("stats").style.display = "flex";

    // Initialize the score and lives display
    this.updateScoreDisplay();
    this.updateLivesDisplay();

    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
  }

  gameLoop() {
    this.update();

    if (this.gameIsOver) {
      clearInterval(this.gameIntervalId);
    }
  }

  update() {
    this.player.move();

    // obstacles
    for (let i = 0; i < this.obstacles.length; i++) {
      const obstacle = this.obstacles[i];
      obstacle.move();

      // update logic so point is scored as soon as obstacle is cleared by player, not when obstacle has disappeared from gameScreen

      if (
        !obstacle.cleared &&
        obstacle.top > this.player.top + this.player.height
      ) {
        obstacle.cleared = true;
        this.score++;
        this.updateScoreDisplay();
      }

      //

      if (this.player.didCollide(obstacle)) {
        obstacle.element.remove();
        this.obstacles.splice(i, 1);
        this.lives--;
        this.updateLivesDisplay(); // Update lives display when lives decrease
        i--;
      } else if (obstacle.top > this.height + 150) {
        this.score++;
        this.updateScoreDisplay(); // Update score display when score increases
        obstacle.element.remove();
        this.obstacles.splice(i, 1);
        i--;
      }
    }

    // introducing cookies
    for (let i = 0; i < this.cookies.length; i++) {
      const cookie = this.cookies[i];
      cookie.move();

      if (this.player.didCollide(cookie)) {
        cookie.element.remove();
        this.cookies.splice(i, 1);
        this.score++; // Bonus points for collecting cookie

        // Extra HP for collecting cookie if HP dangerously low

        if (this.lives === 1) {
          this.lives++;
          this.updateLivesDisplay();
        }
        //
        this.updateScoreDisplay();
        i--;
      } else if (cookie.top > this.height + 80) {
        // Cookie passed by without collection - no effect on lives or score
        cookie.element.remove();
        this.cookies.splice(i, 1);
        i--;
      }
    }

    if (this.lives === 0) {
      this.endGame();
    }

    // drop obstacles
    if (Math.random() > 0.98 && this.obstacles.length < 1) {
      this.obstacles.push(new Obstacle(this.gameScreen));
    }

    // drop cookies
    if (Math.random() > 0.995 && this.cookies.length < 1) {
      this.cookies.push(new Cookie(this.gameScreen));
    }
  }

  // Update score and lives counter in UI
  updateScoreDisplay() {
    this.scoreElement.textContent = this.score;
  }

  // update livesd display to enable pizza emoji view
  updateLivesDisplay() {
    this.livesElement.innerHTML = "";

    for (let i = 0; i < this.lives; i++) {
      const pizzaSlice = document.createElement("span");
      pizzaSlice.className = "pizza-life";
      pizzaSlice.textContent = "🍕";

      if (this.lives === 1 && i === 0) {
        pizzaSlice.classList.add("flashing");
      }

      this.livesElement.appendChild(pizzaSlice);
    }
  }

  endGame() {
    this.player.element.remove();
    this.obstacles.forEach((obstacle) => obstacle.element.remove());
    this.cookies.forEach((cookie) => cookie.element.remove());

    this.gameIsOver = true;

    this.gameScreen.style.display = "none";

    this.gameEndScreen.style.display = "block";

    // Hide the lives display on game over
    document.getElementById("life-slices").parentElement.style.display = "none";

    // Make the score bigger and center it
    const scoreElement = document.getElementById("score").parentElement;
    scoreElement.style.fontSize = "2em";
    scoreElement.style.textAlign = "center";

    // Center the stats div content on game over
    document.getElementById("stats").style.justifyContent = "center";
  }
}
