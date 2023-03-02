import { ClickOutcome, Roof } from "../MineField"

export interface ClosedTileProps {
    tileValue : number,
    roofValue : Roof,
    clickOutcome : ClickOutcome
}


export default function ClosedTile (props : ClosedTileProps) {

    let className : string = '';

    if (props.roofValue === Roof.Flag) className = 'Flag';
    if (props.roofValue === Roof.Question) className = 'Question';

    if (props.clickOutcome !== ClickOutcome.GameContinues) {
        if (props.roofValue === Roof.Flag && props.tileValue !== -1) className = 'Mistake'
        if (props.roofValue !== Roof.Flag && props.tileValue === -1) className = 'Mine'
    }

    return <div className={`Tile Closed ${className}`}>
    </div>    
}