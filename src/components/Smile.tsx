import { GameState } from "./App"
import { useState, useEffect } from "react";

/*
    Watches over the state of the game while changing expressions.
    Also serves as a reset button. 
*/

export interface SmileProps {
    gameState : GameState,
    setGameState : React.Dispatch<React.SetStateAction<GameState>>
}

export default function Smile ({gameState, setGameState} : SmileProps) {
    const [isScared, setIsScared] = useState<boolean>(false);

    let emote : string = '';

    if (gameState === GameState.Lost) {emote = 'Lose'}
    else if (gameState === GameState.Won) {emote = 'Win'}

    function handlePressSmile () {
        setGameState(GameState.Preparing);
    }

    // Handle scare
    useEffect(() => {
        if (gameState !== GameState.Preparing && gameState !== GameState.Continue) return;

        const playGrid = document.querySelector('.PlayGrid');

        function handleScare (event : Event) {

            if ((event as MouseEvent).button !== 0) return;

            setIsScared(true);

            function removeScare () {
                setIsScared(false);
                document.removeEventListener('mouseup', removeScare);
            }

            document.addEventListener('mouseup', removeScare);
        }

        playGrid?.addEventListener('mousedown', handleScare);
        return () => {
            playGrid?.addEventListener('mousedown', handleScare);
        }
    }, [gameState]);

    return <div className={`Smile ${emote} ${isScared ? 'Scared' : ''}`} 
    onClick={handlePressSmile}/>
}