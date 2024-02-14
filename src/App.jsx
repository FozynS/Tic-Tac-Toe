import { useState, useEffect } from "react";
import "./App.css";

function Start({ onClick }) {
  return (
    <button className="start-btn" onClick={onClick}>
      Set nickname
    </button>
  );
}

function ModalWindow({ onClick, activeClass }) {
  const [firstPlayerNameState, setFirstPlayerNameState] = useState("");
  const [secondPlayerNameState, setSecondPlayerNameState] = useState("");

  const handleStartGame = () => {
    onClick(firstPlayerNameState, secondPlayerNameState);
  };
  return (
    <div className={`modal-window ${activeClass}`}>
      <h1>First Player</h1>
      <input
        type="text"
        value={firstPlayerNameState}
        onChange={(e) => setFirstPlayerNameState(e.target.value)}
      />
      <h2>Second Player</h2>
      <input
        type="text"
        value={secondPlayerNameState}
        onChange={(e) => setSecondPlayerNameState(e.target.value)}
      />
      <button onClick={handleStartGame}>Let's go</button>
    </div>
  );
}
function Player({ nickname, value }) {
  return (
    <div>
      <h2>
        {nickname}: <span>{value}</span>
      </h2>
    </div>
  );
}

function Square({ value, onSquareClick }) {
  return <button onClick={onSquareClick}>{value}</button>;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Board({setPlayerValueState}) {
  const [xIsNext, setXIsNext] = useState(true);
  const [squaresState, setSquaresState] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [winningPlayer, setWinningPlayer] = useState(null);

  const handleClick = function (i) {
    if (winner || squaresState[i]) {
      return; // Игнорировать нажатия, если уже есть победитель или клетка уже занята
    }
    const nextSquares = squaresState.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquaresState(nextSquares);
    setXIsNext(!xIsNext);
  };
  useEffect(() => {
    const winner = calculateWinner(squaresState);
    if (winner) {
      setWinner(winner);
      setWinningPlayer(winner);
      setPlayerValueState(prevState => ({
        ...prevState,
        [winner]: prevState[winner] + 1
      }));
      setTimeout(() => {
        setSquaresState(Array(9).fill(null));
        setWinner(null);
        setXIsNext(true);
      }, 3000);
    } else if (squaresState.every(square => square !== null) && !winner) {
      setTimeout(() => {
        setSquaresState(Array(9).fill(null));
        setXIsNext(true);
      }, 3000);
    }
  }, [squaresState, setPlayerValueState]);
  
  let status;
  if (winner) {
    status = "Winner is: " + winner;
  } else if (squaresState.every(square => square !== null)) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <h2 className="next-player">{status}</h2>
      <div className="content">
        <div className="board-row">
          {[0, 1, 2].map((item, index) => (
            <Square key={index} value={squaresState[item]} onSquareClick={() => handleClick(item)} />
          ))}
        </div>
        <div className="board-row">
        {[3, 4, 5].map((item, index) => (
            <Square key={index} value={squaresState[item]} onSquareClick={() => handleClick(item)} />
          ))}
        </div>
        <div className="board-row">
        {[6, 7, 8].map((item, index) => (
            <Square key={index} value={squaresState[item]} onSquareClick={() => handleClick(item)} />
          ))}
        </div>
      </div>
    </>
  );
}

function App() {
  const [showModalState, setShowModalState] = useState(false);

  const [firstPlayerNameState, setFirstPlayerNameState] = useState("Player");
  const [secondPlayerNameState, setSecondPlayerNameState] = useState("Player");
  const [playerValueState, setPlayerValueState] = useState({ "X": 0, "O": 0 }); // Обновляем состояние для хранения значений обоих игроков


  const onShowModal = () => {
    console.log("Start Game!");
    setShowModalState(true);
  };

  const closeAndStartGame = (firstPlayerName, secondPlayerName) => {
    setShowModalState(false);
    setFirstPlayerNameState(firstPlayerName);
    setSecondPlayerNameState(secondPlayerName);
  };

  return (
    <section className="section">
      <Start onClick={onShowModal} />

      <div className={`modal-wrapper ${showModalState ? "active" : ""}`}>
        <ModalWindow
          activeClass={showModalState ? "active" : ""}
          onClick={closeAndStartGame}
        />
      </div>

      <Board setPlayerValueState={setPlayerValueState} />

      <div className="players">
        <Player nickname={`${firstPlayerNameState}` + " X"} value={playerValueState['X']} />
        <Player nickname={`${secondPlayerNameState}` + " O"} value={playerValueState['O']} />
      </div>
    </section>
  );
}

export default App;
