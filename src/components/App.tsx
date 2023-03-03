import { useEffect, useState } from 'react';

import './css/App.css';
import PlayGrid from './PlayGrid';
import UpperBar from './UpperBar';

export enum GameState {
  Preparing,
  Continue,
  Won,
  Lost
}

function App() {

  const [gameState, setGameState] = useState<GameState>(GameState.Preparing);

  const [timer, setTimer] = useState<number>(0);
  const [flagsLeft, setFlagsLeft] = useState<number>(40);

  // Handle Timer
  useEffect(() => {
    if (gameState === GameState.Continue) {

      const intervalId = setInterval(() => setTimer((prev) => prev + 1), 1000)

      return () => clearInterval(intervalId);
    }
    if (gameState === GameState.Preparing) setTimer(0);
    
  }, [gameState])

  // Handle Flags Left
  useEffect(() => {
    if (gameState === GameState.Preparing) setFlagsLeft(40);
  }, [gameState])

  return (
    <div className="App">
      <div className='Wrapper'>
        <UpperBar flagsLeft={flagsLeft} timer={timer} gameState={gameState} setGameState={setGameState}/>
        <PlayGrid 
        gameState={gameState} 
        setGameState={setGameState}
        flagsLeft={flagsLeft}
        setFlagsLeft={setFlagsLeft}/>
      </div>
    </div>
  );
}

export default App;
