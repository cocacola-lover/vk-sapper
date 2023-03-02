import './css/PlayGrid.css';
import OpenTile from './OpenTile';
import MineField from '../MineField';

/*
    x - down, y - right
*/

export default function PlayGrid () {
    const mineField = new MineField([1, 0]);

    return (<div className='PlayGrid'>
        {
            mineField.mapArr((value, index1, index2) => {
                return <OpenTile key={`${index1},${index2}`} tileValue={value}/>
            })
        }
    </div>)
}