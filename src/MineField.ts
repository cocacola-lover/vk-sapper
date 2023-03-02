
/*
    MineFieldArr values : 
    -1 - mine,
    0, 1, 2... - mines around.

    VisibilityArr value : 
    false - not seen
    true - seen
*/

enum ClickOutcome {
    GameContinues, Lost, Won
}

const size = 16;
const mineCount = 40;

export default class MineField {
    public readonly arr : number[][];
    public readonly visibilityArr : boolean[][]

    private tilesLeft = size * size - mineCount;

    constructor(clickedOn : number[]) {
        this.arr = this.createMineFieldArray(clickedOn);
        this.visibilityArr = this.createVisibilityArray();

        this.clickOn(clickedOn);
    }

    private createVisibilityArray () {
        const ans : boolean[][] = [];

        // Create size x size array;

        for (let i = 0; i < size; i++) {
            ans.push([]);
            for (let j = 0; j < size; j++) {
                ans[i].push(false);
            }
        }

        return ans;
    }

    private createMinesArray (except: number[]) {
        function getRandomIndex () {
            return Math.floor(Math.random() * (size));
        }

        let ans : number[][] = [];

        while (ans.length < mineCount) {

            const x = getRandomIndex();
            const y = getRandomIndex();

            if (x === except[0] && y === except[1]) continue;

            ans = ans.filter((pair) => (pair[0] !== x || pair[1] !== y));
            ans.push([x, y]);
        }

        return ans;
    }

    private createMineFieldArray (clickedOn : number[]) {
        const ans : number[][] = [];

        // Create size x size array;

        for (let i = 0; i < size; i++) {
            ans.push([]);
            for (let j = 0; j < size; j++) {
                ans[i].push(0);
            }
        }

        const minesArray = this.createMinesArray(clickedOn);

        // Populate with mines.
        
        minesArray.forEach((pair) => {
            ans[pair[0]][pair[1]] = -1;
        });

        // Add numbers to tiles adjustened to mines.
        minesArray.forEach((pair) => {

            const tilesAround = this.getTilesAround(pair, ans);

            tilesAround.forEach((pair) => {
                const [x, y] = pair;

                // Avoid mines
                if (ans[x][y] === -1) return;

                ans[x][y] += 1;
            });
        });

        return ans;
    }

    private getTilesAround (pair : number[], arr : number[][] = this.arr) {

        const ans : number[][] = [];

        const [originalX, originalY] = pair;

        const moveOne = [0, -1, 1]; 
        
        moveOne.forEach((x) => {
            moveOne.forEach((y) => {

                const newX = x + originalX;
                const newY = y + originalY;

                if (arr[newX] === undefined || arr[newX][newY] === undefined) return;

                ans.push([newX, newY]);

            })
        })

        return ans;
    }

    clickOn (pair : number[]) {

        // Open stuff up
        const queue = [pair];

        while (queue.length !== 0) {

            const newPair = queue.shift() as number[];
            
            const [x, y] =  newPair;

            this.visibilityArr[x][y] = true;
            this.tilesLeft--;

            // Stop search if not clear
            if (this.arr[x][y] !== 0) continue;

            let tilesAround = this.getTilesAround(newPair);

            // Filter already found
            tilesAround = tilesAround.filter((pair) => {
                const [x, y] = pair;

                return !this.visibilityArr[x][y];
            });



            while(tilesAround.length !== 0) queue.push(tilesAround.shift() as number[]);
        }
        // Check Stop conditions
        if (this.arr[pair[0]][pair[1]] === -1) return ClickOutcome.Lost;

        if (this.tilesLeft === 0) return ClickOutcome.Won;

        return ClickOutcome.GameContinues;
    }

    private map<ArrType, OutType>(arr : ArrType[][], func : (value : ArrType, index1 : number, index2 : number) => OutType) {
        return arr.map((row, index1) => row.map((element, index2) => {
            return func(element, index1, index2);
        }))
    }

    mapArr<OutType>(func : (value : number, index1 : number, index2 : number) => OutType) {
        return this.map<number, OutType>(this.arr, func);
    }

    mapVisibilityArr<OutType> (func : (value : boolean, index1 : number, index2 : number) => OutType) {
        return this.map<boolean, OutType>(this.visibilityArr, func);
    }
}