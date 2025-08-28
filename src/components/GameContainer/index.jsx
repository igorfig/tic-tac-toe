import { useState, useEffect } from 'react';
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

  const onPlay = (id) => {
    const nextTurn = turn === 'x' ? 'o' : 'x'
    setBoard(( )=> {
      const newBoard = [...board];
      
      newBoard[id] = turn;
      setTurn(nextTurn)
      return newBoard
    })
  
  }

  const onReset = () => {
    setBoard(Array(9).fill(null));
    setTurn('x');
    setWinner(null);
    setFinished(false);
  }

  useEffect(() => {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    const winnerFound = winPatterns.find((pattern) => {
      const [a, b, c] = pattern;
      return board[a] && board[a] === board[b] && board[a] === board[c]
    })
    if(winnerFound) {
       setWinner(board[winnerFound[0]]);
       setFinished(true);
    }

    const isBoardFull  = board.every(cell => cell !== null);

    isBoardFull && setFinished(true);

  }, [board])

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
            {board.map(( cell, index ) => {

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
