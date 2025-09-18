class Obstacle {
  constructor(gameScreen, game) {
    this.gameScreen = gameScreen;
    this.game = game;
    this.left = Math.floor(Math.random() * 300 + 70);
    this.top = -150;
    this.width = 65;
    this.height = 150;
    this.element = document.createElement("img");

    this.element.src = "assets/redCar.png";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;

    this.cleared = false; // update logic so point is scored as soon as obstacle is cleared by player, not when obstacle has disappeared from gameScreen

    this.element.style.zIndex = "2";

    this.gameScreen.appendChild(this.element);
  }

  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  move() {
    this.top += this.game.obstacleSpeed;
    this.updatePosition();
  }
}
