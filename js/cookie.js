class Cookie {
  constructor(gameScreen, game) {
    this.gameScreen = gameScreen;
    this.game = game;
    this.left = Math.floor(Math.random() * 300 + 70);
    this.top = -80;
    this.width = 80;
    this.height = 80;
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
    //   this.top += this.game.cookieSpeed;
    this.top += 7;
    this.updatePosition();
  }
}
