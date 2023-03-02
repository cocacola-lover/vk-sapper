import './css/Tile.css';

export interface OpenTileProps {
    tileValue : number,
}

export default function OpenTile (props : OpenTileProps) {
    return <div className={`Tile Open mines${props.tileValue}`}>
    </div>
}