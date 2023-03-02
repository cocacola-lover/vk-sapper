import React, { useState } from 'react';

import './css/App.css';
import PlayGrid from './PlayGrid';

export enum GameState {
  Preparing,
  Continue,
  Won,
  Lost
}

function App() {

  const [gameState, setGameState] = useState<GameState>(GameState.Preparing);

  return (
    <div className="App">
      <div className='Wrapper'>
        <PlayGrid gameState={gameState} setGameState={setGameState}/>
      </div>
    </div>
  );
}

export default App;
