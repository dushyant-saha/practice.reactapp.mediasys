import { useState } from 'react';

const Box = (props) => {
    return (
        <div className="block">
            <h1 className={props.colour}>{props.heading}</h1>
            <p>This is a sample paragraph</p>
            <button onClick={() => props.changeColour(props.id, "red")}>Red</button>
            <button onClick={() => props.changeColour(props.id, "yellow")}>Yellow</button>
            <button onClick={() => props.changeColour(props.id, "green")}>Green</button>
            <button onClick={() => props.changeColour(props.id, "blue")}>Blue</button>
        </div>
    );
}

const Stats = (props) => {
    let black = 0, red = 0, green = 0, blue = 0, yellow = 0;
    let boxes = props.data;
    boxes.forEach(
        box => {
            if (box.color == 'black')
                black++;
            if (box.color == 'red')
                red++;
            if (box.color == 'green')
                green++;
            if (box.color == 'blue')
                blue++;
            if (box.color == 'yellow')
                yellow++;

        }
    )
    return (
        <div className="block">
            <h1>Colour Usage Stats</h1>
            <ul>
                <li className="highlight-orange">Black <button>{black}</button></li>
                <li className="highlight-orange">Red <button>{red}</button></li>
                <li className="highlight-orange">Green <button>{green}</button></li>
                <li className="highlight-orange">Blue <button>{blue}</button></li>
                <li className="highlight-orange">Yellow <button>{yellow}</button></li>
            </ul>
        </div>
    );
}


const initialState = [
            { id: 1, heading: 'First Heading', color: 'black' },
            { id: 2, heading: 'Second Heading', color: 'black' },
            { id: 3, heading: 'Third Heading', color: 'black' },
            { id: 4, heading: 'Fourth Heading', color: 'black' },
            { id: 5, heading: 'Fifth Heading', color: 'black' },
            { id: 6, heading: 'Sixth Heading', color: 'black' },
        ];

export const LegacyPractice = () => {
const [boxes, setBoxes] = useState(initialState);

    // function changeColour(id, colour) {
    //     let boxArray = boxes;//this is a new array now
    //     boxArray[id - 1].color = colour;
    //     setBoxes(boxArray);
    //     console.log(id,colour);
    // }

    const changeColour = (id, newColour) => {
        // Immutable state update (avoids mutating state directly)
        setBoxes((prevBoxes) =>
            prevBoxes.map((box) =>
                box.id === id ? { ...box, color: newColour } : box
            )
        );
    };
    
    return (
        <section className="base-page">
            {boxes.map(box =>
                <Box key={box.id} id={box.id} heading={box.heading} colour={box.color} changeColour={changeColour} />
            )}

            <Stats data={boxes} />
        </section>
    );
}