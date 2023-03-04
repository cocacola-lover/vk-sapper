import './css/PlayGrid.css';
import { OpenTile, ClosedTile } from './Tile';
import MineField, {ClickOutcome, Roof} from '../MineField';
import { GameState } from './App';

import { useRef, useEffect, useMemo, useState } from 'react';
import useHTMLElementSizes, {HTMLElementSizes} from '../hooks/useHTMLElementSizes';

/*
    Display MineField class to the user. And handles signal transmission between them.

    x - down, y - right
*/

export interface PlayGridProps {
    gameState : GameState,
    setGameState : React.Dispatch<React.SetStateAction<GameState>>

    flagsLeft : number,
    setFlagsLeft : React.Dispatch<React.SetStateAction<number>>
}

export default function PlayGrid ({gameState, setGameState, setFlagsLeft} : PlayGridProps) {

    // Actions are used for force rerender on change of mineField.
    // There are better ways to do this. But for this project this seemed good enough.
    const [actions, setActions] = useState(0);

    // Which tile shoud not have a mine. Is set to undefined on Gamestate.Preparing
    const [except, setExcept] = useState<number[] | undefined> ();

    const mineField = useMemo(
        () =>  new MineField(except)
    , [except]);

    const playGridRef = useRef<HTMLDivElement>(null);
    const sizes = useHTMLElementSizes(playGridRef);

    // Handles right and left click on the game field.
    useEffect(() => {
        function calculatePositionOnBoard (sizes : HTMLElementSizes, mousePosition : number[]) {

            let x = mousePosition[0] - sizes.x;
            let y = mousePosition[1] - sizes.y;

            // mouse out of board
            if (x < 0 || y < 0 || x > (sizes.height) || y > (sizes.width)) return undefined;

            const stepUp = sizes.height / mineField.arr.length;
            const stepRight = sizes.width / mineField.arr.length;

            let i = 0, j = 0;
            while (x > stepUp) {
                x -= stepUp;
                i++;
            }
            while (y > stepRight) {
                y -= stepRight;
                j++;
            }

            return [i, j];
        }

        function handleOnLeftClick (event : MouseEvent) {

            // Works only on leftClick
            if (event.button !== 0) return;

            const calculation = calculatePositionOnBoard(sizes, [event.clientY, event.clientX])

            // Return if click somehow out of board
            if (calculation === undefined) return;

            if (gameState === GameState.Preparing) {

                setExcept(calculation);
                setGameState(GameState.Continue);
            }
            else if (gameState === GameState.Continue) {
            
                const outcome = mineField.clickOn(calculation);
                // Making sure flags are up to date
                setFlagsLeft(mineField.FlagsLeft)

                if (outcome === ClickOutcome.Lost) setGameState(GameState.Lost)
                if (outcome === ClickOutcome.Won) setGameState(GameState.Won)

                setActions((prev) => prev + 1);
            }
        }

        function handleOnRightClick (event : MouseEvent) {
            
            const calculation = calculatePositionOnBoard(sizes, [event.clientY, event.clientX])

            if (calculation === undefined || gameState === GameState.Preparing) return;

            // Prevent Context Menu from appearing
            event.preventDefault();

            mineField.rightClickOn(calculation);

            setFlagsLeft(mineField.FlagsLeft);
            setActions((prev) => prev + 1);    

        }

        if (gameState === GameState.Lost || gameState === GameState.Won) return;

        document.addEventListener('mouseup', handleOnLeftClick);
        document.addEventListener('contextmenu', handleOnRightClick);

        return () => {
            document.removeEventListener('mouseup', handleOnLeftClick);
            document.removeEventListener('contextmenu', handleOnRightClick);
        }
    }, [actions, sizes, mineField, except, gameState, setGameState, setFlagsLeft])

    // Make sure game resets on GameState.Preparing
    useEffect(() => {
        if (gameState === GameState.Preparing) setExcept(undefined);
    }, [gameState])

    return (<div className='PlayGrid' ref={playGridRef}>
        {
            mineField.mapArr((value, index1, index2) => {

                return mineField.roofArr[index1][index2] === Roof.Open ? 

                <OpenTile key={`${index1},${index2}`} tileValue={value}/> :
                
                <ClosedTile key={`${index1},${index2}`} 
                tileValue={value} 
                roofValue={mineField.roofArr[index1][index2]}
                gameState={gameState}/>
            })
        }
    </div>)
}