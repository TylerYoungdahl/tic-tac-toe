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

    for (let i = 0; i < rows; i++) {
      if (
        board[i][0].getValue() !== " " &&
        board[i][0].getValue() === board[i][1].getValue() &&
        board[i][1].getValue() === board[i][2].getValue()
      ) {
        return board[i][0].getValue();
      }
    }

    for (let i = 0; i < columns; i++) {
      if (
        board[0][i].getValue() !== " " &&
        board[0][i].getValue() === board[1][i].getValue() &&
        board[1][i].getValue() === board[2][i].getValue()
      ) {
        return board[0][i].getValue();
      }
    }

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
  const board = Gameboard();

  const players = [
    { player: 1, marker: "X" },
    { player: 2, marker: "O" },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  board.printBoard();
  console.log(`Player ${activePlayer.player}'s turn.`);

  const printNewRound = () => {
    board.printBoard();
    console.log(`Player ${activePlayer.player}'s turn.`);
  };

  const playRound = (row, column) => {
    board.placeMarker(row, column, getActivePlayer().marker);
    const winner = board.checkWinner();

    if (winner === "tie") {
      board.printBoard();
      console.log(`It's a tie!`);
    } else if (!winner) {
      switchPlayerTurn();
      printNewRound();
    } else {
      board.printBoard();
      console.log(
        `Player ${
          winner === players[0].marker ? players[0].player : players[1].player
        } wins!`
      );
    }
  };
  return { switchPlayerTurn, getActivePlayer, printNewRound, playRound };
}

const game = GameController();
