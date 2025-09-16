window.onload = function () {
  function handleKeydown(event) {
    const key = event.key;
    const possibleKeystrokes = [
      "ArrowLeft",
      "ArrowUp",
      "ArrowRight",
      "ArrowDown",
    ];

    if (possibleKeystrokes.includes(key)) {
      event.preventDefault();

      switch (key) {
        case "ArrowLeft":
          game.player.directionX = -5;
          // also rotate player counterclockwise when turning left
          game.player.setRotation(-10);
          //
          break;
        case "ArrowUp":
          game.player.directionY = -3;
          break;
        case "ArrowRight":
          // also rotate player clockwise when turning right
          game.player.setRotation(10);
          //
          game.player.directionX = 5;
          break;
        case "ArrowDown":
          game.player.directionY = 2;
          break;
      }
    }
  }

  // change behaviour to only steer while arrow key pressed

  function handleKeyup(event) {
    const key = event.key;
    const possibleKeystrokes = [
      "ArrowLeft",
      "ArrowUp",
      "ArrowRight",
      "ArrowDown",
    ];

    if (possibleKeystrokes.includes(key)) {
      event.preventDefault();

      switch (key) {
        case "ArrowLeft":
        case "ArrowRight":
          game.player.directionX = 0;
          // reset rotation to 0 when releasing arrow keys
          game.player.setRotation(0);
          //
          break;
        case "ArrowUp":
        case "ArrowDown":
          game.player.directionY = 0;
          break;
      }
    }
  }

  // include handleKeyUp below!

  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("keyup", handleKeyup);

  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");

  let game;

  startButton.addEventListener("click", function () {
    startGame();
  });

  restartButton.addEventListener("click", function () {
    restartGame();
  });

  function startGame() {
    console.log("start game");
    game = new Game();

    game.start();
  }

  function restartGame() {
    location.reload();
  }
};
