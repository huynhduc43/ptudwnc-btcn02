import React from "react";

function Square({ value, onClick, highlighted }) {
  return (
    <button className={highlighted ? "winner-square" : "square"} onClick={onClick}>
      {value}
    </button>
  );
}

export default Square;