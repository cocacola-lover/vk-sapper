import './css/PlayGrid.css';
import OpenTile from './OpenTile';
import ClosedTile from './ClosedTile';
import MineField, {ClickOutcome, Roof} from '../MineField';
import { GameState } from './App';

import { useRef, useEffect, useMemo, useState } from 'react';
import useHTMLElementSizes, {HTMLElementSizes} from '../hooks/useHTMLElementSizes';

/*
    x - down, y - right
*/

export interface PlayGridProps {
    gameState : GameState,
    setGameState : React.Dispatch<React.SetStateAction<GameState>>

    flagsLeft : number,
    setFlagsLeft : React.Dispatch<React.SetStateAction<number>>
}

export default function PlayGrid ({gameState, setGameState, flagsLeft, setFlagsLeft} : PlayGridProps) {

    const [actions, setActions] = useState(0);
    const [except, setExcept] = useState<number[] | undefined> ();

    const mineField = useMemo(() => {
        return new MineField(except);
    }, [except]);

    const playGridRef = useRef<HTMLDivElement>(null);
    const sizes = useHTMLElementSizes(playGridRef);

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

            if (event.button !== 0) return;

            const calculation = calculatePositionOnBoard(sizes, [event.clientY, event.clientX])

            if (calculation === undefined) return;

            if (mineField.roofArr[calculation[0]][calculation[1]] === Roof.Flag || 
                    mineField.roofArr[calculation[0]][calculation[1]] === Roof.Question) {
                        setFlagsLeft(prev => prev + 1);
            }

            if (except === undefined) {
                setExcept(calculation);
                setGameState(GameState.Continue);
                return;
            }

            const outcome = mineField.clickOn(calculation);

            if (outcome === ClickOutcome.Lost) setGameState(GameState.Lost)
            if (outcome === ClickOutcome.Won) setGameState(GameState.Won)

            setActions((prev) => prev + 1);
        }

        function handleOnRightClick (event : MouseEvent) {
            
            const calculation = calculatePositionOnBoard(sizes, [event.clientY, event.clientX])

            if (calculation === undefined) return;

            event.preventDefault();

            const [x, y] = calculation

            if ( (mineField.roofArr[x][y] === Roof.Blank && flagsLeft > 0) ||
                    (mineField.roofArr[x][y] !== Roof.Blank)) {

                if (mineField.roofArr[x][y] === Roof.Blank) setFlagsLeft(prev => prev - 1);
                else if (mineField.roofArr[x][y] === Roof.Question) setFlagsLeft(prev => prev + 1);

                mineField.rightClickOn(calculation)
                setActions((prev) => prev + 1);    
                return;
            }
        }

        if (gameState === GameState.Lost || gameState === GameState.Won) return;

        document.addEventListener('mouseup', handleOnLeftClick);
        document.addEventListener('contextmenu', handleOnRightClick);

        return () => {
            document.removeEventListener('mouseup', handleOnLeftClick);
            document.removeEventListener('contextmenu', handleOnRightClick);
        }
    }, [actions, sizes, mineField, except, gameState, setGameState, flagsLeft, setFlagsLeft])

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