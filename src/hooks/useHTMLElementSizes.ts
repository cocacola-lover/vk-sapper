import { useState, useLayoutEffect } from "react";

/*
    Hook used to update HTMLElement's position and size on window resize.
*/

export interface HTMLElementSizes {
    x : number,
    y : number, 
    height : number, 
    width : number
}

export default function useHTMLElementSizes (ref : React.RefObject<HTMLElement>) {
    const [sizes, setSizes] = useState<HTMLElementSizes>({x : 0, y : 0, height : 0, width : 0});

    useLayoutEffect(() => {
        const element = ref.current;

        function updateSizes () {
            if (element === null) return;

            setSizes({
                y : element.getBoundingClientRect().left,
                x : element.getBoundingClientRect().top,
                width : element.offsetWidth,
                height : element.offsetHeight,
            })
        }

        window.addEventListener('resize', updateSizes);
        updateSizes();

        return () => {
            window.removeEventListener('resize', updateSizes);
        }
    }, [ref]);

    return sizes;
}