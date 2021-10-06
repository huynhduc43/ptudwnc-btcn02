import React, { useState } from "react";
import Board from "../Board/Board";
import './Game.css';

function Game() {
  const [size, setSize] = useState(5);
  const [history, setHistory] = useState([
    {
      squares: Array(25).fill(null),
      clickedPos: "",
    }
  ]);
  const [xIsNext, setXIsNext] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);
  const [selectedItem, setSelectedItem] = useState(-1);
  const [isAscending, setIsAscending] = useState(true);
  const [winner, setWinner] = useState(null);
  const [line, setLine] = useState([]);
  const [sizeInput, setSizeInput] = useState("5");

  let moves = history.map((step, move) => {
    const desc = move ?
      'Go to move #' + move + ": " + step.clickedPos :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move, setStepNumber, setXIsNext, setWinner, setSelectedItem)}>
          {move === selectedItem ? <b>{desc}</b> : desc}
        </button>
      </li>
    );
  });

  if (!isAscending) moves = moves.reverse();

  let status;

  if (winner) {
    status = 'Winner: ' + winner;
  } else if (stepNumber === size * size) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          size={size}
          squares={history[stepNumber].squares}
          onClick={(i) => {
            const currentHistory = history.slice(0, stepNumber + 1);
            handleClick(i, currentHistory, winner, xIsNext, size,
              setHistory, setXIsNext, setStepNumber, setSelectedItem, setWinner, setLine);
          }}
          highlight={winner ? line : null}
        />
      </div>
      <div className="game-info">
        <form>
          <div>
            {"Size of board: "}
            <input
              className="size-input"
              type="text" value={sizeInput}
              onChange={(e) => handleChangeSize(e, setSizeInput)}
            />
            {" x "}
            <input
              className="size-input"
              value={sizeInput}
              disabled
            />
            <button type="submit" className="submit-btn"
              onClick={(e) => handleApplySize(
                e, sizeInput, size,
                setSizeInput, setSize, setHistory, setStepNumber, setWinner, setXIsNext, setSelectedItem, setLine
              )}
            >
              Apply
            </button>
          </div>
        </form>
        <h2>{status}</h2>
        {(winner || stepNumber === size * size) &&
          <button onClick={() =>
            handlePlayAgain(size, setHistory, setStepNumber, setWinner, setXIsNext, setSelectedItem, setIsAscending, setLine)}
          >
            Play again
          </button>}
        <div className="sort-div">Sort: <button
          onClick={() => setIsAscending(!isAscending)}
        >
          {isAscending ? "Ascending" : "Descending"}
        </button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

/**
 * Handle click event with a square in a round
 * @param {*} i position of square
 * @param {*} currentHistory board with clicked position in a current round
 * @param {*} winner not null ('X' or 'O') if game have a winner
 * @param {*} xIsNext true if the next player is player X
 * @param {*} size size of board
 * @param {*} setHistory 
 * @param {*} setXIsNext 
 * @param {*} setStepNumber 
 * @param {*} setSelectedItem 
 * @param {*} setWinner 
 * @param {*} setLine 
 * @returns 
 */

function handleClick(
  i, currentHistory, winner, xIsNext, size,
  setHistory, setXIsNext, setStepNumber, setSelectedItem, setWinner, setLine
) {
  const currentBoard = currentHistory[currentHistory.length - 1];
  const squares = currentBoard.squares.slice();

  if (winner || squares[i]) {
    return;
  }

  squares[i] = xIsNext ? 'X' : 'O';
  let player = null;
  let winLine = [];
  let result = calculateWinner(squares, size, i);

  if (result) {
    player = result.player;
    winLine = [...result.line];
  }

  const col = i % size + 1;
  const row = Math.floor(i / size) + 1;

  setHistory(
    currentHistory.concat([{
      squares: squares,
      clickedPos: `(${col}, ${row})`,
    }])
  );
  setXIsNext(!xIsNext);
  setStepNumber(currentHistory.length);
  setSelectedItem(currentHistory.length);
  setWinner(player);
  setLine([...winLine]);
}

/**
 * Jump to the chosen turn in the game's history
 * @param {*} step the chosen turn
 * @param {*} setStepNumber 
 * @param {*} setXIsNext 
 * @param {*} setWinner 
 * @param {*} setSelectedItem 
 */

function jumpTo(step, setStepNumber, setXIsNext, setWinner, setSelectedItem) {
  setStepNumber(step);
  setXIsNext((step % 2) === 0);
  setWinner(null);
  setSelectedItem(step);
}

/**
 * Check for a winner and there are no more turns to make
 * @param {*} squares current board
 * @param {*} size size of board
 * @param {*} pos position of the newest clicked square
 * @returns null or object: {player: the winner, line: line of winner}
 */

function calculateWinner(squares, size, pos) {
  const winPoint = size >= 5 ? 4 : size - 1;
  let point = 0;
  let col = pos % size;
  let row = Math.floor(pos / size);
  let x, y, checkPos;
  let line = [];
  let tmpLine = [];

  // Kiểm tra chiến thắng theo cột
  // Các điểm phía dưới điểm vừa đánh 
  x = row + 1;
  y = col;
  checkPos = x * size + y;

  while (x < size && squares[checkPos] === squares[pos]) {
    point += 1;
    x += 1;
    tmpLine.push(checkPos);
    checkPos = x * size + y;
  }

  // Các điểm phía trên điểm vừa đánh
  x = row - 1;
  checkPos = x * size + y;

  while (x >= 0 && squares[checkPos] === squares[pos]) {
    point += 1;
    x -= 1;
    tmpLine.push(checkPos);
    checkPos = x * size + y;
  }

  if (point >= winPoint) {
    line = [...line, ...tmpLine];
  }

  // Kiểm tra chiến thắng theo hàng
  // Các điểm bên trái điểm vừa đánh
  point = 0
  x = row;
  y = col + 1;
  tmpLine = [];
  checkPos = x * size + y;

  while (y < size && squares[checkPos] === squares[pos]) {
    point += 1;
    y += 1;
    tmpLine.push(checkPos);
    checkPos = x * size + y;
  }

  // Các điểm bên phải điểm vừa đánh
  y = col - 1;
  checkPos = x * size + y;

  while (y >= 0 && squares[checkPos] === squares[pos]) {
    point += 1;
    y -= 1;
    tmpLine.push(checkPos);
    checkPos = x * size + y;
  }

  if (point >= winPoint) {
    line = [...line, ...tmpLine];
  }

  // Kiểm tra chiến thắng theo đường chéo phải
  // Các điểm phía dưới điểm vừa đánh
  point = 0
  x = row + 1;
  y = col + 1;
  checkPos = x * size + y;
  tmpLine = [];

  while (x < size && y < size && squares[checkPos] === squares[pos]) {
    point += 1;
    x += 1;
    y += 1;
    tmpLine.push(checkPos);
    checkPos = x * size + y;
  }

  // Các điểm phía trên điểm vừa đánh
  x = row - 1;
  y = col - 1;
  checkPos = x * size + y;

  while (x >= 0 && y >= 0 && squares[checkPos] === squares[pos]) {
    point += 1;
    x -= 1;
    y -= 1;
    tmpLine.push(checkPos);
    checkPos = x * size + y;
  }

  if (point >= winPoint) {
    line = [...line, ...tmpLine];
  }

  // Kiểm tra chiến thắng theo đường chéo trái
  // Các điểm phía dưới điểm vừa đánh
  point = 0
  x = row + 1;
  y = col - 1;
  checkPos = x * size + y;
  tmpLine = [];

  while (x < size && y >= 0 && squares[checkPos] === squares[pos]) {
    point += 1;
    x += 1;
    y -= 1;
    tmpLine.push(checkPos);
    checkPos = x * size + y;
  }

  // Các điểm phía trên điểm vừa đánh
  x = row - 1;
  y = col + 1;
  checkPos = x * size + y;

  while (x >= 0 && y < size && squares[checkPos] === squares[pos]) {
    point += 1;
    x -= 1;
    y += 1;
    tmpLine.push(checkPos);
    checkPos = x * size + y;
  }

  if (point >= winPoint) {
    line = [...line, ...tmpLine];
  }

  if (line.length > 0) {
    line.push(pos);
    return {
      player: squares[pos],
      line: line,
    };
  }

  return null;
}

/**
 * Change size of board
 * @param {*} e onChange event
 * @param {*} setSizeInput 
 * @returns 
 */

function handleChangeSize(e, setSizeInput) {
  if (isNaN(e.target.value)) {
    alert("Not a number! Please try again!");
    return;
  }
  setSizeInput(e.target.value);
}

/**
 * Set up size of board
 * @param {*} e submit event
 * @param {*} sizeInput new size
 * @param {*} size current size of board
 * @param {*} setSizeInput 
 * @param {*} setSize 
 * @param {*} setHistory 
 * @param {*} setStepNumber 
 * @param {*} setWinner 
 * @param {*} setXIsNext 
 * @param {*} setSelectedItem 
 * @param {*} setLine 
 * @returns 
 */

function handleApplySize(
  e, sizeInput, size,
  setSizeInput, setSize, setHistory, setStepNumber, setWinner, setXIsNext, setSelectedItem, setLine
) {
  e.preventDefault();
  const newSize = Number(sizeInput);

  if (newSize < 5) {
    alert("The size of the board must be greater than 5! Please try again!");
    setSizeInput(size);
    return;
  }

  setSize(newSize);
  setHistory([
    {
      squares: Array(newSize * newSize).fill(null),
      clickedPos: ""
    }
  ]);
  setStepNumber(0);
  setWinner(null);
  setXIsNext(true);
  setSelectedItem(-1);
  setLine([]);
}

/**
 * Reset game to play again with old size and sorting
 * @param {*} size size of board
 * @param {*} setHistory 
 * @param {*} setStepNumber 
 * @param {*} setWinner 
 * @param {*} setXIsNext 
 * @param {*} setSelectedItem 
 * @param {*} setIsAscending 
 * @param {*} setLine 
 */

function handlePlayAgain(
  size, setHistory,
  setStepNumber, setWinner, setXIsNext, setSelectedItem, setIsAscending, setLine
) {
  setHistory([
    {
      squares: Array(size * size).fill(null),
      clickedPos: ""
    }
  ]);
  setStepNumber(0);
  setWinner(null);
  setXIsNext(true);
  setSelectedItem(-1);
  setLine([]);
}

export default Game;