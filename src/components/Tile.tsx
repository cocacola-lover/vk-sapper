import { Roof } from "../MineField"
import { GameState } from "./App";

import './css/Tile.css';

/*
    Tiles displaying information about the game.
*/

export interface ClosedTileProps {
    tileValue : number,
    roofValue : Roof,
    gameState : GameState
}


export interface OpenTileProps {
    tileValue : number,
}


export function ClosedTile ({gameState, tileValue, roofValue} : ClosedTileProps) {

    let className : string = '';

    if (roofValue === Roof.Flag) className = 'Flag';
    if (roofValue === Roof.Question) className = 'Question';

    if (gameState === GameState.Lost || gameState === GameState.Won) {
        if (roofValue === Roof.Flag && tileValue !== -1) className = 'Mistake'
        if (roofValue !== Roof.Flag && tileValue === -1) className = 'Mine'
    }

    return <div className={`Tile Closed ${className}`}/>
}

export function OpenTile (props : OpenTileProps) {
    return <div className={`Tile Open mines${props.tileValue}`}/>
}