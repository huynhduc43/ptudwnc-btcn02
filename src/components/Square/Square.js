import React from "react";
import './Square.css';

function Square({ value, onClick, highlighted }) {
  return (
    <button className={highlighted ? "winner-square" : "square"} onClick={onClick}>
      {value}
    </button>
  );
}

export default Square;