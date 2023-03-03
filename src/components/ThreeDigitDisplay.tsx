import './css/ThreeDigitDisplay.css'

export interface ThreeDigitDisplayProps {
    value : number
}

export default function ThreeDigitDisplay ({value} : ThreeDigitDisplayProps) {

    function convertNumber (num : number) {
        if (num >= 999) return [9, 9, 9];
        if (num <= 0) return [0, 0, 0];

        return [
            Math.floor(num / 100),
            Math.floor(num / 10) % 10,
            (num % 10)
        ]
    }

    const number = convertNumber(value);

    return (<div className="ThreeDigitDisplay">
        <div className={`DigitDisplay Value${number[0]}`}></div>
        <div className={`DigitDisplay Value${number[1]}`}></div>
        <div className={`DigitDisplay Value${number[2]}`}></div>
    </div>)
}