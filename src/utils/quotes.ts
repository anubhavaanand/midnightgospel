export interface Quote {
    text: string;
    author: string;
    level: number;
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
}

export const LEVEL_QUOTES: Quote[] = [
    // Level 1: Zombie Apocalypse / Taste of the King
    {
        text: "There is no way to survive... except by undergoing death.",
        author: "Clancy Gilroy",
        level: 1,
        position: [5, 4, -5],
        rotation: [0, -0.5, 0],
        scale: 0.8,
    },
    {
        text: "I think we're all just running from the void.",
        author: "Little President",
        level: 1,
        position: [-6, 2, -2],
        rotation: [0, 0.5, 0],
        scale: 0.6,
    },

    // Level 2: Clown Planet / Officers and Wolves
    {
        text: "Suffering is just attachment to a specific outcome.",
        author: "Deneen Fendig",
        level: 2,
        position: [0, 5, -10],
        rotation: [0, 0, 0],
        scale: 1,
    },
    {
        text: "Accept the mess. The mess is where the magic is.",
        author: "Raghu Markus",
        level: 2,
        position: [4, 2, -5],
        rotation: [0, -0.3, 0],
        scale: 0.7,
    },

    // Level 3: Ass Cream / Hunters Without Home
    {
        text: "You can't stop the waves, but you can learn to surf.",
        author: "Ram Dass",
        level: 3,
        position: [0, 8, 0],
        rotation: [0.1, 0, 0],
        scale: 1.2,
    },
    {
        text: "Home isn't a place. It's a frequency.",
        author: "Darryl the Fish",
        level: 3,
        position: [-5, 3, 5],
        rotation: [0, 0.5, 0],
        scale: 0.8,
    },

    // Level 4: Soul Prison / Annihilation of Joy
    {
        text: "You can't die in a sim prison. You can only be reborn.",
        author: "Jason Louv",
        level: 4,
        position: [0, 6, -5],
        rotation: [0, 0, 0],
        scale: 1,
    },
    {
        text: "The ego is just a spacesuit for the soul.",
        author: "Clancy",
        level: 4,
        position: [6, 3, 0],
        rotation: [0, -0.5, 0],
        scale: 0.8,
    }
];
