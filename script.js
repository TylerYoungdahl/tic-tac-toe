function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];

    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeMarker = (row, column, player) => {
    if (board[row][column].getValue() === " ") {
      board[row][column].updateCell(player);
    } else {
      return;
    }
  };

  const checkWinner = () => {
    const allCells = [];

    // horizontal wins
    for (let i = 0; i < rows; i++) {
      if (
        board[i][0].getValue() !== " " &&
        board[i][0].getValue() === board[i][1].getValue() &&
        board[i][1].getValue() === board[i][2].getValue()
      ) {
        return board[i][0].getValue();
      }
    }

    // vertical wins
    for (let i = 0; i < columns; i++) {
      if (
        board[0][i].getValue() !== " " &&
        board[0][i].getValue() === board[1][i].getValue() &&
        board[1][i].getValue() === board[2][i].getValue()
      ) {
        return board[0][i].getValue();
      }
    }

    // diagonal wins
    if (
      board[0][0].getValue() !== " " &&
      board[0][0].getValue() === board[1][1].getValue() &&
      board[0][0].getValue() === board[2][2].getValue()
    ) {
      return board[0][0].getValue();
    }

    if (
      board[0][2].getValue() !== " " &&
      board[0][2].getValue() === board[1][1].getValue() &&
      board[0][2].getValue() === board[2][0].getValue()
    ) {
      return board[0][2].getValue();
    }

    // tie
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        allCells.push(board[i][j].getValue());
      }
    }
    if (!allCells.includes(" ")) {
      return "tie";
    }

    return null;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );

    console.log(boardWithCellValues);
  };

  return { getBoard, placeMarker, checkWinner, printBoard };
}

function Cell() {
  let value = " ";
  const updateCell = (player) => {
    value = player;
  };
  const getValue = () => value;

  return { updateCell, getValue };
}

function GameController() {
  const announcer = document.querySelector(".announcer");
  const boardContainer = document.querySelector(".board-container");
  const resetBtn = document.querySelector("#reset-game");
  const playerNamesContainer = document.querySelector(
    ".player-names-container"
  );
  const board = Gameboard();

  const resetUI = () => {
    boardContainer.innerHTML = "";

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const tile = document.createElement("div");
        tile.classList.add("board-cell");
        if (board.getBoard()[i][j].getValue() === "X") {
          tile.classList.add("x-tile");
        } else if (board.getBoard()[i][j].getValue() === "O") {
          tile.classList.add("o-tile");
        }
        tile.textContent = `${board.getBoard()[i][j].getValue()}`;
        tile.dataset.row = `${i}`;
        tile.dataset.col = `${j}`;

        boardContainer.appendChild(tile);

        tile.addEventListener("click", (event) => {
          playRound(parseInt(tile.dataset.row), parseInt(tile.dataset.col));
        });
      }
    }
  };

  // players
  const players = [
    { player: 1, name: "", marker: "X" },
    { player: 2, name: "", marker: "O" },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  // return to start screen
  const resetGame = () => {
    playerNamesContainer.style.visibility = "visible";
    playerNamesContainer.innerHTML = `<h1>Enter Player Names:</h1>
          <div class="inputs">
            <input
              type="text"
              name="player1"
              id="player1"
              placeholder="Player 1"
            />
            <input
              type="text"
              name="player2"
              id="player2"
              placeholder="Player 2"
            />
          </div>
          <button class="btn" id="start-btn">Start</button>`;
    const startBtn = document.querySelector("#start-btn");
    startBtn.addEventListener("click", startGame);
    resetBtn.style.visibility = "hidden";
    boardContainer.innerHTML = "";
    announcer.textContent = "";
  };

  // start game
  const startGame = () => {
    const player1Input = document.querySelector("#player1");
    const player2Input = document.querySelector("#player2");
    players[0].name = player1Input.value || "Player 1";
    players[1].name = player2Input.value || "Player 2";
    playerNamesContainer.style.visibility = "hidden";
    playerNamesContainer.innerHTML = "";
    resetUI();
    printNewRound();
  };

  const printNewRound = () => {
    board.printBoard();
    console.log(`${activePlayer.name}'s turn.`);
    announcer.textContent = `${activePlayer.name}'s turn.`;
  };

  const playRound = (row, column) => {
    board.placeMarker(row, column, getActivePlayer().marker);
    const winner = board.checkWinner();

    if (winner === "tie") {
      board.printBoard();
      console.log(`It's a tie!`);
      announcer.textContent = `It's a tie!`;
      resetUI();
      resetBtn.style.visibility = "visible";
    } else if (!winner) {
      switchPlayerTurn();
      resetUI();
      printNewRound();
    } else {
      board.printBoard();
      resetUI();
      console.log(
        `Player ${
          winner === players[0].marker ? players[0].name : players[1].name
        } wins!`
      );
      announcer.textContent = `${
        winner === players[0].marker ? players[0].name : players[1].name
      } wins!`;
      resetBtn.style.visibility = "visible";
    }
  };

  resetGame();

  resetBtn.addEventListener("click", resetGame);

  return {
    resetUI,
    switchPlayerTurn,
    getActivePlayer,
    printNewRound,
    playRound,
    startGame,
    resetGame,
  };
}

const game = GameController();
