import { UniverseType, UniverseConfig, Episode } from './types';

export const UNIVERSES: Record<UniverseType, UniverseConfig> = {
    [UniverseType.SURREAL]: {
        name: 'Chromatic Dreamscape',
        primaryColor: '#ff00ff',
        secondaryColor: '#7000ff',
        accentColor: '#00ffff',
        shaderSpeed: 1.0,
        distortion: 0.5,
        gravity: 0.05,
    },
    [UniverseType.GLITCH]: {
        name: 'The Digital Decay',
        primaryColor: '#00ff00',
        secondaryColor: '#003300',
        accentColor: '#ff0000',
        shaderSpeed: 2.5,
        distortion: 1.2,
        gravity: 0.2,
    },
    [UniverseType.CELESTIAL]: {
        name: 'Astral Plane',
        primaryColor: '#00aaff',
        secondaryColor: '#000033',
        accentColor: '#ffaa00',
        shaderSpeed: 0.5,
        distortion: 0.2,
        gravity: 0.02,
    },
    [UniverseType.VOID]: {
        name: 'The Eternal Echo',
        primaryColor: '#444444',
        secondaryColor: '#000000',
        accentColor: '#ffffff',
        shaderSpeed: 0.2,
        distortion: 0.1,
        gravity: 0.0,
    }
};

export const EPISODES: Episode[] = [
    { id: 1, title: 'Taste of a King', guest: 'Dr. Drew Pinsky', topic: 'Drugs & Legalization', description: 'Clancy visits Earth 4-169 to interview the president about the benefits and drawbacks of drug use during a zombie apocalypse.', universe: UniverseType.SURREAL },
    { id: 2, title: 'Officers and Wolves', guest: 'Anne Lamott & Raghu Markus', topic: 'Love & Death', description: 'In a world of clown babies, Clancy explores the nature of unconditional love and facing mortality.', universe: UniverseType.CELESTIAL },
    { id: 3, title: 'Hunters Without a Home', guest: 'Damien Echols', topic: 'Magic & Enlightenment', description: 'Clancy interviews a fish-man wizard about the transformational power of ceremonial magic.', universe: UniverseType.VOID },
    { id: 4, title: 'Blinded by My End', guest: 'Trudy Goodman', topic: 'Forgiveness', description: 'Clancy visits a medieval world to talk about the importance of listening and forgiveness with a healing knight.', universe: UniverseType.CELESTIAL },
    { id: 5, title: 'Annihilation of Joy', guest: 'Jason Louv', topic: 'Hope & Existence', description: 'In a high-security prison for simulated beings, Clancy discusses the cycle of suffering and liberation.', universe: UniverseType.GLITCH },
    { id: 6, title: 'Vulture with Honor', guest: 'David Nichtern', topic: 'Meditation', description: 'Clancy joins a meditation master on a mission to understand the quiet mind amidst chaos.', universe: UniverseType.SURREAL },
    { id: 7, title: 'Turtles of the Eclipse', guest: 'Caitlin Doughty', topic: 'The Death Industry', description: 'Clancy encounters Death herself and discusses the western world\'s relationship with the end of life.', universe: UniverseType.VOID },
    { id: 8, title: 'Mouse of Silver', guest: 'Deneen Fendig', topic: 'Life & Motherhood', description: 'In the final episode, Clancy explores the ultimate cycle of life and death with his own mother.', universe: UniverseType.SURREAL }
];

export const THEMES = [
    { title: 'Simulated Realities', description: 'Exploring the boundaries between the real and the digital.' },
    { title: 'Existentialism', description: 'Confronting the meaning of life in a cosmic scale.' },
    { title: 'Consciousness', description: 'The evolution of self-awareness through meditation and magic.' },
    { title: 'The Bardo', description: 'Navigating the space between life and death.' }
];

export const CHARACTERS = [
    {
        name: 'Clancy Gilroy',
        role: 'The Spacecaster',
        voice: 'Duncan Trussell',
        description: 'A lazy spacecaster who interviews beings from dying worlds using his multiverse simulator.',
        color: '#ff66cc'
    },
    {
        name: 'The Simulator',
        role: 'Universe Engine',
        voice: 'Biological Computer',
        description: 'A glitchy, organic machine shaped like a giant Vagina that generates simulated worlds.',
        color: '#33ff33'
    },
    {
        name: 'Death',
        role: 'The Ultimate End',
        voice: 'Caitlin Doughty',
        description: 'A warm, surprisingly friendly personification of the end of biological life.',
        color: '#ffffff'
    },
    {
        name: 'Charlotte',
        role: 'The Dog/Soul',
        voice: 'The Faithful Companion',
        description: 'A dog that lives in Clancy\'s hat and possesses infinite wisdom of the universe.',
        color: '#ffcc00'
    }
];
