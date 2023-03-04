import './css/UpperBar.css';

import Smile from './Smile';
import { GameState } from './App';
import ThreeDigitDisplay from './ThreeDigitDisplay';

/*
    Upper Bar of the game.
*/

export interface UpperBarProps {
    gameState : GameState,
    setGameState : React.Dispatch<React.SetStateAction<GameState>>

    timer : number,
    flagsLeft : number
}

export default function UpperBar ({gameState, setGameState, timer, flagsLeft} : UpperBarProps) {

    return <div className="UpperBar">
        <ThreeDigitDisplay value={flagsLeft}/>
        <Smile gameState={gameState} setGameState={setGameState}></Smile>
        <ThreeDigitDisplay value={timer}/>
    </div>
}