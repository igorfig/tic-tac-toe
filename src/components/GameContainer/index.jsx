import { useState, useEffect, useMemo, useCallback } from 'react';
import { GameWrapper, Card, Header, Title, Status, WinCounter, Board, Cell, Mark, Footer, ResetButton } from "./styles";

export function GameContainer() {
  const [board, setBoard]= useState(Array(9).fill(null));
  const [turn, setTurn] = useState('x');
  const [winner, setWinner] = useState(null);
  const [winCounter, setWinCounter] = useState({
    'x': 0,
    'o': 0,
    'slatemate': 0
  })

  const [finished, setFinished] = useState(false);

  const winPatterns = useMemo(() => ([
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
  ]), [])

  const randomAiPlay = useCallback(() => {
    const emptyCells = board.map((cell, index) => (cell === null ? index : null)).filter((index) => index !== null);

    if (emptyCells.length === 0) return null;
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }, [board])

  const aiPlay = useCallback(() => {
  setBoard(prevValue => {
    const newBoard = [...prevValue];
    let index = null;

    for (const [a, b, c] of winPatterns) {
      if ((newBoard[a] === null && newBoard[b] === 'x' && newBoard[c] === 'x') ||
          (newBoard[a] === null && newBoard[b] === 'o' && newBoard[c] === 'o')) {
        index = a; 
        break;
      }

      if ((newBoard[a] === 'x' && newBoard[b] === null && newBoard[c] === 'x') ||
          (newBoard[a] === 'o' && newBoard[b] === null && newBoard[c] === 'o')) {
        index = b; 
        break;
      }

      if ((newBoard[a] === 'x' && newBoard[b] === 'x' && newBoard[c] === null) ||
          (newBoard[a] === 'o' && newBoard[b] === 'o' && newBoard[c] === null)) {
        index = c; 
        break;
      }
    }

    // fallback se não encontrou jogada
    if(index === null) {
      const random = randomAiPlay();
      newBoard[random] = 'o';
    }

    newBoard[index] = 'o'; // IA joga como 'o'
    return newBoard;
  });

    setTurn('x');
  }, [winPatterns, randomAiPlay]);

  // 1 HUMANO
  const playerPlay = (id) => {
  // Se a célula já estiver ocupada ou o jogo estiver acabado, não faz nada
  if (board[id] !== null || finished) return;
  
  const newBoard = [...board];
  // 1. Humano joga (O sempre)
    
  newBoard[id] = "x";

  setBoard(newBoard);
  setTurn('o');

};


const onPlay = (id) => {
  if (finished || turn !== "x") return; 
  playerPlay(id);
};

useEffect(() => {
  if (turn === "o" && !finished) {
    const timer = setTimeout(() => {
      aiPlay();
    }, 500); // delayzinho de "pensamento"

    return () => clearTimeout(timer);
  }
}, [turn, aiPlay, board, finished]);

  const onReset = () => {
    setBoard(Array(9).fill(null));
    setTurn('x');
    setWinner(null);
    setFinished(false);
  }

  useEffect(() => {
    const winnerFound = winPatterns.find((pattern) => {
      const [a, b, c] = pattern;
      return board[a] && board[a] === board[b] && board[a] === board[c]
    })
    if(winnerFound) {
       setWinner(board[winnerFound[0]]);
       setFinished(true);
    }

    const isBoardFull = board.every(cell => cell !== null);

    isBoardFull && setFinished(true);

  // eslint-disable-turn-line react-hooks/exhaustive-deps
  }, [winPatterns, board])

useEffect(() => {
  if(finished) {
    setWinCounter(prevValue => winner != null ? {
        ...prevValue,
        [winner]: (prevValue[winner] ?? 0) + 1,
      } : {
        ...prevValue,
        'slatemate': (prevValue['slatemate'] ?? 0) + 1,
      }
    )
  }
}, [finished, winner]);

  return (
    <GameWrapper>
      <Card>
        <Header>
          <Title>Jogo da Velha</Title>
          <Status>
            {!finished ? (
              <>
                <WinCounter> O: {winCounter.o} </WinCounter>
                <WinCounter> X: {winCounter.x} </WinCounter>
                <WinCounter>Empate: {winCounter.slatemate}</WinCounter>
              </>
            ): 
              winner != null ? `${winner.toUpperCase()} GANHOU!` : 'EMPATE!'
            }
          </Status>
        </Header>

        <Board>
            {board.map((cell, index) => {

              const variant = cell === 'x' ? 'x' : 'o';
              return (
                <Cell 
                key={index}
                $variant={variant}
                $winning={winner !== null}
                onClick={() => onPlay(index)}
                disabled={cell !== null || winner !== null}
                >
                  {cell && <Mark $variant={cell}/>}
                </Cell>
            )
           
            })}
        </Board>

        <Footer>
          <div />
          <ResetButton onClick={onReset}>
            Reiniciar
          </ResetButton>
        </Footer>
      </Card>
    </GameWrapper>
  );
}
