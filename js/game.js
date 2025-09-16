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
    this.gameIsOver = false;
    this.gameIntervalId;
    this.gameLoopFrequency = Math.round(1000 / 60);

    // Get references to the score and lives display elements
    this.scoreElement = document.getElementById("score");
    this.livesElement = document.getElementById("lives");
  }

  start() {
    this.gameScreen.style.height = `${this.height}px`;
    this.gameScreen.style.width = `${this.width}px`;

    this.startScreen.style.display = "none";

    this.gameScreen.style.display = "block";

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

      if (this.player.didCollide(obstacle)) {
        obstacle.element.remove();
        this.obstacles.splice(i, 1);
        this.lives--;
        this.updateLivesDisplay(); // Update lives display when lives decrease
        i--;
      } else if (obstacle.top > this.height) {
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
        this.lives++; // Extra HP for collecting cookie
        this.score++; // Bonus points for collecting cookie
        this.updateLivesDisplay();
        this.updateScoreDisplay();
        i--;
      } else if (cookie.top > this.height) {
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

  updateLivesDisplay() {
    this.livesElement.textContent = this.lives;
  }

  endGame() {
    this.player.element.remove();
    this.obstacles.forEach((obstacle) => obstacle.element.remove());
    this.cookies.forEach((cookie) => cookie.element.remove());

    this.gameIsOver = true;

    this.gameScreen.style.display = "none";

    this.gameEndScreen.style.display = "block";
  }
}
