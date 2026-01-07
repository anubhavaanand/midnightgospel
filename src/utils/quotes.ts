export interface Quote {
    text: string;
    author: string;
    level: number;
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
    episodeRef?: string;
}

/**
 * Quotes from The Midnight Gospel research data
 * Organized by level/episode with authentic dialogue and themes
 */
export const LEVEL_QUOTES: Quote[] = [
    // Level 0: Chromatic Void - Simulator Introduction
    {
        text: "Welcome to the Multiverse Simulator. Please select a dying world.",
        author: "Universe Simulator",
        level: 0,
        position: [0, 6, -8],
        rotation: [0, 0, 0],
        scale: 0.9,
        episodeRef: "Intro",
    },
    {
        text: "The Chromatic Ribbon is my home. It's a colorful void filled with infinite possibility.",
        author: "Clancy Gilroy",
        level: 0,
        position: [-5, 3, -12],
        rotation: [0, 0.3, 0],
        scale: 0.7,
        episodeRef: "Intro",
    },

    // Level 1: Zombie Apocalypse / Taste of the King (Episode 1)
    {
        text: "There is no way to survive... except by undergoing death.",
        author: "Clancy Gilroy",
        level: 1,
        position: [5, 4, -5],
        rotation: [0, -0.5, 0],
        scale: 0.8,
        episodeRef: "Ep. 1: Taste of the King",
    },
    {
        text: "There are no bad drugs, only bad consequences from using them incorrectly.",
        author: "Dr. Drew Pinsky",
        level: 1,
        position: [-6, 2, -2],
        rotation: [0, 0.5, 0],
        scale: 0.6,
        episodeRef: "Ep. 1: Taste of the King",
    },
    {
        text: "Psychedelics can be a gateway to spiritual understanding.",
        author: "Little President",
        level: 1,
        position: [3, 5, -8],
        rotation: [0, -0.2, 0],
        scale: 0.65,
        episodeRef: "Ep. 1: Taste of the King",
    },

    // Level 2: Clown Planet / Officers and Wolves (Episode 2)
    {
        text: "Suffering is just attachment to a specific outcome.",
        author: "Anne Lamott",
        level: 2,
        position: [0, 5, -10],
        rotation: [0, 0, 0],
        scale: 1,
        episodeRef: "Ep. 2: Officers and Wolves",
    },
    {
        text: "Accept the mess. The mess is where the magic is.",
        author: "Raghu Markus",
        level: 2,
        position: [4, 2, -5],
        rotation: [0, -0.3, 0],
        scale: 0.7,
        episodeRef: "Ep. 2: Officers and Wolves",
    },
    {
        text: "Death and rebirth are natural processes. Jesus faced death with acceptance.",
        author: "Annie Deer Dog",
        level: 2,
        position: [-5, 4, -7],
        rotation: [0, 0.4, 0],
        scale: 0.75,
        episodeRef: "Ep. 2: Officers and Wolves",
    },

    // Level 3: Ass Cream / Hunters Without Home (Episode 3)
    {
        text: "You can't stop the waves, but you can learn to surf.",
        author: "Damien Echols",
        level: 3,
        position: [0, 8, 0],
        rotation: [0.1, 0, 0],
        scale: 1.2,
        episodeRef: "Ep. 3: Hunters Without a Home",
    },
    {
        text: "Home isn't a place. It's a frequency.",
        author: "Darryl the Fish",
        level: 3,
        position: [-5, 3, 5],
        rotation: [0, 0.5, 0],
        scale: 0.8,
        episodeRef: "Ep. 3: Hunters Without a Home",
    },
    {
        text: "Magic is anything someone can achieve on a spiritual level.",
        author: "Damien Echols",
        level: 3,
        position: [6, 5, -3],
        rotation: [0, -0.4, 0],
        scale: 0.7,
        episodeRef: "Ep. 3: Hunters Without a Home",
    },
    {
        text: "The Bible becomes a magical text when read with the right eyes.",
        author: "Darryl the Fish",
        level: 3,
        position: [2, 2, 8],
        rotation: [0, 0.2, 0],
        scale: 0.65,
        episodeRef: "Ep. 3: Hunters Without a Home",
    },

    // Level 4: Blinded by My End (Episode 4)
    {
        text: "Forgiveness is giving up the hope that the past could have been any different.",
        author: "Trudy Goodman",
        level: 4,
        position: [0, 6, -5],
        rotation: [0, 0, 0],
        scale: 1,
        episodeRef: "Ep. 4: Blinded by My End",
    },
    {
        text: "To listen is to lean in softly with a willingness to be changed by what we hear.",
        author: "Trudy Goodman",
        level: 4,
        position: [-5, 3, -2],
        rotation: [0, 0.3, 0],
        scale: 0.9,
        episodeRef: "Ep. 4: Blinded by My End",
    },
    {
        text: "There is a kind of love that doesn't care if you're broken.",
        author: "Clancy",
        level: 4,
        position: [4, 4, 3],
        rotation: [0, -0.4, 0],
        scale: 0.8,
        episodeRef: "Ep. 4: Blinded by My End",
    },

    // Level 5: Soul Prison / Annihilation of Joy (Episode 5)
    {
        text: "You can't die in a sim prison. You can only be reborn.",
        author: "Jason Louv",
        level: 5,
        position: [0, 6, -5],
        rotation: [0, 0, 0],
        scale: 1,
        episodeRef: "Ep. 5: Annihilation of Joy",
    },
    {
        text: "The ego is just a spacesuit for the soul.",
        author: "Clancy",
        level: 5,
        position: [6, 3, 0],
        rotation: [0, -0.5, 0],
        scale: 0.8,
        episodeRef: "Ep. 5: Annihilation of Joy",
    },
    {
        text: "All souls are connected like Indra's Net - one infinite web of consciousness.",
        author: "Soul Bird Jason",
        level: 5,
        position: [-4, 5, -2],
        rotation: [0, 0.3, 0],
        scale: 0.75,
        episodeRef: "Ep. 5: Annihilation of Joy",
    },
    {
        text: "Hopelessness is liberation from expectation.",
        author: "Prisoner Bob",
        level: 5,
        position: [3, 2, 4],
        rotation: [0, -0.2, 0],
        scale: 0.7,
        episodeRef: "Ep. 5: Annihilation of Joy",
    },

    // Level 6: The Exit / Transcendence (Finale themes)
    {
        text: "Even through catastrophe, there is opportunity to grow.",
        author: "The Midnight Gospel",
        level: 6,
        position: [0, 8, -8],
        rotation: [0, 0, 0],
        scale: 1.1,
        episodeRef: "Series Theme",
    },
    {
        text: "Love transcends physical death. It's the only thing that truly remains.",
        author: "Deneen Fendig",
        level: 6,
        position: [-4, 5, -5],
        rotation: [0, 0.3, 0],
        scale: 0.85,
        episodeRef: "Ep. 8: Mouse of Silver",
    },
    {
        text: "Death is not an ending. It's a transformation into something infinite.",
        author: "Caitlin Doughty",
        level: 6,
        position: [5, 6, -3],
        rotation: [0, -0.4, 0],
        scale: 0.8,
        episodeRef: "Ep. 7: Turtles of the Eclipse",
    },
    {
        text: "We are not trapped in our bodies. We are wearing them temporarily.",
        author: "Clancy",
        level: 6,
        position: [0, 3, 0],
        rotation: [0, 0, 0],
        scale: 0.9,
        episodeRef: "Finale",
    },
];

/**
 * Get quotes for a specific level
 */
export function getQuotesForLevel(level: number): Quote[] {
    return LEVEL_QUOTES.filter(q => q.level === level);
}

/**
 * Get a random quote for a level
 */
export function getRandomQuoteForLevel(level: number): Quote | undefined {
    const levelQuotes = getQuotesForLevel(level);
    if (levelQuotes.length === 0) return undefined;
    return levelQuotes[Math.floor(Math.random() * levelQuotes.length)];
}
