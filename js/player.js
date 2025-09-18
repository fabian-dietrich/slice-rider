class Player {
  constructor(gameScreen, left, top, width, height, imgSrc) {
    this.gameScreen = gameScreen;
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.directionX = 0;
    this.directionY = 0;
    // add player rotation for turns – track current rotation
    this.rotation = 0;
    //
    this.element = document.createElement("img");

    this.element.src = imgSrc;
    this.element.style.position = "absolute";

    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;

    // addd smooth transition on rotation
    this.element.style.transition = "transform 0.2s ease-out";
    this.element.style.transformOrigin = "center center";
    //

    this.gameScreen.appendChild(this.element);
  }

  move() {
    this.left += this.directionX;

    this.top += this.directionY;

    if (this.left < 20) {
      this.left = 20;
    }

    if (this.top < 20) {
      this.top = 20;
    }

    if (this.left > this.gameScreen.offsetWidth - this.width - 20) {
      this.left = this.gameScreen.offsetWidth - this.width - 20;
    }

    if (this.top > this.gameScreen.offsetHeight - this.height - 20) {
      this.top = this.gameScreen.offsetHeight - this.height - 20;
    }

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
    // add player rotation when steering
    this.element.style.transform = `rotate(${this.rotation}deg)`;
  }

  setRotation(degrees) {
    this.rotation = degrees;
    this.updatePosition();
  }
  //

  didCollide(obstacle) {
    const playerRect = this.element.getBoundingClientRect();
    const obstacleRect = obstacle.element.getBoundingClientRect();

    if (
      playerRect.left < obstacleRect.right &&
      playerRect.right > obstacleRect.left &&
      playerRect.top < obstacleRect.bottom &&
      playerRect.bottom > obstacleRect.top
    ) {
      return true;
    } else {
      return false;
    }
  }
}
