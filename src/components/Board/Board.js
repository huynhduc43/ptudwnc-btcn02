import React from "react";
import Square from "../Square";
import './Board.css';

function Board({ size, squares, highlight, onClick }) {
  let board = [];

  if (highlight) {
    for (let i = 0; i < size; i++) {
      let row = [];

      for (let j = i * size; j < i * size + size; j++) {
        row.push(renderSquare(j, squares[j], highlight.indexOf(j) !== -1, onClick));
      }

      board.push(<div key={`row-${i}`} className="board-row">{row}</div>);
    }
  } else {
    for (let i = 0; i < size; i++) {
      let row = [];

      for (let j = i * size; j < i * size + size; j++) {
        row.push(renderSquare(j, squares[j], null, onClick));
      }

      board.push(<div key={`row-${i}`} className="board-row">{row}</div>);
    }
  }

  return board;
}

/**
 * Render a square with value X | O | null and highlight win square
 * @param {*} pos position of square in squares list
 * @param {*} value value of a square to display in position pos
 * @param {*} highlighted true if game have a winner
 * @param {*} onClick handle click event in a square
 * @returns {JSX.Element} Square component
 */

function renderSquare(pos, value, highlighted, onClick) {
  return (
    <Square
      key={pos}
      value={value}
      onClick={() => onClick(pos)}
      highlighted={highlighted}
    />
  );
}

export default Board;