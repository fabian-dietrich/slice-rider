class Cookie {
  constructor(gameScreen, game) {
    this.gameScreen = gameScreen;
    this.game = game;
    this.left = Math.floor(Math.random() * 300 + 70);
    this.top = -40;
    this.width = 40;
    this.height = 40;
    this.element = document.createElement("img");

    this.element.src = "assets/cookie.png";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;

    this.element.style.zIndex = "1";

    this.gameScreen.appendChild(this.element);
  }

  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  move() {
    //   this.top += this.game.cookieSpeed; / doesn't seem to be taking this value from game JS?
    this.top += 7;
    this.updatePosition();
  }
}
