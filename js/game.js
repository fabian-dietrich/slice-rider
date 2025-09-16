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
    this.score = 0;
    this.lives = 3;
    this.gameIsOver = false;
    this.gameIntervalId;
    this.gameLoopFrequency = Math.round(1000 / 60);

    // Get references to the score and lives display elements

    this.scoreElement = document.getElementById("score");
    this.livesElement = document.getElementById("lives");

    //
  }

  //

  start() {
    this.gameScreen.style.height = `${this.height}px`;
    this.gameScreen.style.width = `${this.width}px`;

    this.startScreen.style.display = "none";

    this.gameScreen.style.display = "block";

    // Initialize the display with current values
    this.updateScoreDisplay();
    this.updateLivesDisplay();
    //

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

    if (this.lives === 0) {
      this.endGame();
    }

    if (Math.random() > 0.98 && this.obstacles.length < 1) {
      this.obstacles.push(new Obstacle(this.gameScreen));
    }
  }

  //

  updateScoreDisplay() {
    this.scoreElement.textContent = this.score;
  }

  updateLivesDisplay() {
    this.livesElement.textContent = this.lives;
  }

  //

  endGame() {
    this.player.element.remove();
    this.obstacles.forEach((obstacle) => obstacle.element.remove());

    this.gameIsOver = true;

    this.gameScreen.style.display = "none";

    this.gameEndScreen.style.display = "block";
  }
}
