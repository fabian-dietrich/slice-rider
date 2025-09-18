class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro");
    this.gameScreen = document.getElementById("game-screen");
    this.gameEndScreen = document.getElementById("game-end");

    this.player = new Player(
      this.gameScreen,
      217,
      500,
      65,
      150,
      "assets/hero.png"
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


    // LINE BELOW: this.CookiesSpeed does not appear to be referenced consistently so it is hard coded to 9 px/frame in cookie.js
   // this.cookieSpeed = 9; // same as background when CSS set to 2.67s linear infinite (stationary appearance)
    this.obstacleSpeed = 4.5; // slower than background (traffic moving in same direction)

    // get references to score, timer and lives display elements
    this.scoreElement = document.getElementById("score");
    this.timerElement = document.getElementById("timer");
    this.livesElement = document.getElementById("life-slices"); // update to adopt pizza slice lives dynamic

    this.gameStartTime = null;
    this.difficultyLevel = 0;
    this.baseObstacleRate = 0.98; // initial obstacle spawn rate
    this.baseCookieRate = 0.995;
  }

  start() {
    this.gameScreen.style.height = `${this.height}px`;
    this.gameScreen.style.width = `${this.width}px`;

    this.startScreen.style.display = "none";

    this.gameScreen.style.display = "block";

    document.getElementById("stats").style.display = "flex";

    // init score and lives display
    this.updateScoreDisplay();
    this.updateLivesDisplay();

    this.gameStartTime = Date.now(); // record when game started to show countdown timer

    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
  }

  gameLoop() {
    this.update();

    this.updateTimerDisplay();

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
        this.updateLivesDisplay(); // update lives display when lives decrease
        i--;
      } else if (obstacle.top > this.height + 150) {
        this.score++;
        // update score display when score increases:
        this.updateScoreDisplay();
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
        // cookie missed, no points
        cookie.element.remove();
        this.cookies.splice(i, 1);
        i--;
      }
    }

    if (this.lives === 0) {
      this.endGame();
    }

    // commenting out to try new complicated game logic increasing spawn rat eover time

    // drop obstacles
    // if (Math.random() > 0.98 && this.obstacles.length < 1) {
    //   this.obstacles.push(new Obstacle(this.gameScreen, this));
    // }

    // drop cookies
    // if (Math.random() > 0.995 && this.cookies.length < 1) {
    //   this.cookies.push(new Cookie(this.gameScreen, this));
    // }

    //

    // Calculate current difficulty level (increases every 30 seconds)
    const currentTime = Date.now();
    const elapsedSeconds = (currentTime - this.gameStartTime) / 1000;
    this.difficultyLevel = Math.floor(elapsedSeconds / 10);

    // Increase spawn rates based on difficulty level (gets harder over 3 minutes)
    const obstacleRate = Math.max(
      0.7,
      this.baseObstacleRate - this.difficultyLevel * 0.15
    );
    const cookieRate = Math.max(
      0.98,
      this.baseCookieRate - this.difficultyLevel * 0.001
    );

    // drop obstacles (with collision checking)
    if (Math.random() > obstacleRate && this.obstacles.length < 3) {
      let attempts = 0;
      let validPosition = false;

      while (attempts < 10 && !validPosition) {
        const newLeft = Math.floor(Math.random() * 300 + 70);
        const newWidth = 65;

        if (this.isPositionClear(newLeft, newWidth)) {
          this.obstacles.push(new Obstacle(this.gameScreen, this));
          // Update obstacle's position to safe position
          this.obstacles[this.obstacles.length - 1].left = newLeft;
          this.obstacles[this.obstacles.length - 1].updatePosition();
          validPosition = true;
        }
        attempts++;
      }
    }

    // drop cookies
    if (Math.random() > cookieRate && this.cookies.length < 1) {
      this.cookies.push(new Cookie(this.gameScreen, this));
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
    scoreElement.style.fontSize = "1.5em";
    // scoreElement.style.textAlign = "center";

    const timerElement = document.getElementById("timer").parentElement;
    timerElement.style.fontSize = "1.5em";

    // Center the stats div content on game over
    document.getElementById("stats").style.justifyContent = "space-between";
  }

  // check whether position is clear for a new obstacle to spawn (needed to enable variable spawn rate)

  isPositionClear(newLeft, newWidth) {
    for (let obstacle of this.obstacles) {
      // iuncrease padding to avoid clusters
      const padding = 80;
      if (
        newLeft < obstacle.left + obstacle.width + padding &&
        newLeft + newWidth + padding > obstacle.left
      ) {
        return false; // spawn position is blocked
      }
    }
    return true; // spawn position is clear
  }

  // timer logic

  updateTimerDisplay() {
    if (this.gameStartTime) {
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor(
        (currentTime - this.gameStartTime) / 1000
      );
      const minutes = Math.floor(elapsedSeconds / 60);
      const seconds = elapsedSeconds % 60;

      const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
      this.timerElement.textContent = formattedTime;
    }
  }
}
