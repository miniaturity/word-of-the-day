import type { Property } from "$lib/types";
import type { Highlight } from "$lib/types";

export const PROPERTIES: Property[] = [
    {
        id: 0,
        name: "pair",
        desc: "contains two of the same letter",
        probability: 68.9,
        icon: "🧑‍🤝‍🧑",
        score: 350,

        applicable: (word: string) => {
            return /(.).*\1/i.test(word);
        },

        highlight: (word: string) => {
            const firstSeen: Record<string, number> = {};
            let indices: number[] = [];

            for (let i = 0; i < word.length; i++) {
                const char = word[i];

                if (char in firstSeen) {
                    const prevIndex = firstSeen[char];

                    indices = [prevIndex, i];
                    
                } else {
                    firstSeen[char] = i;
                }
            }

            return {
                [indices[0]]: {},
                [indices[1]]: {}
            }
        }
    },
    {
        id: 1,
        name: "vowel",
        desc: "contains at least one vowel",
        probability: 99.8,
        icon: "🌱",
        score: 100,
        
        applicable: (word: string) => {
            return /[aeiou]/i.test(word);
        },

        highlight: (word: string) => {
            const vowels = "aeiou";
            const highlights: Record<number, Highlight> = {};
            for (let i = 0; i < word.length; i++) {
                if (vowels.includes(word[i])) {
                    highlights[i] = {};
                }
            }
            return highlights;
        }
    },
    {
        id: 2,
        name: "consonant",
        desc: "contains at least one consonant",
        probability: 99.98,
        icon: "🪢",
        score: 50,

        applicable: (word: string) => {
            return /[bcdfghjklmnpqrstvwxyz]/i.test(word);
        },

        highlight: (word: string) => {
            const consonants = "bcdfghjklmnpqrstvwxyz";
            const highlights: Record<number, Highlight> = {};
            for (let i = 0; i < word.length; i++) {
                if (consonants.includes(word[i])) {
                    highlights[i] = {};
                }
            }
            return highlights;
        }
    },
    {
        id: 3,
        name: "vowelless",
        desc: "does not contain any vowels",
        probability: .12,
        icon: "🔇",
        score: 50000,

        applicable: (word: string) => {
            return /^[^aeiou]*$/i.test(word);
        }
    },
    {
        id: 4,
        name: "consonantless",
        desc: "does not contain any consonants",
        probability: 0.023,
        icon: "💎",
        score: 153333,

        applicable: (word: string) => {
            return /^[^bcdfghjklmnpqrstvwxyz]*$/i.test(word);
        }
    },
    {
        id: 5,
        name: "furry",
        desc: "contains a popular fursona type as a substring",
        probability: 0.014,
        icon: "🐲",
        score: 264000,
        
        applicable: (word: string) => {
            const furries = [
                "dragon",
                "feline",
                "canine",
                "rodent",
                "avian",
                "aquatic",
                "dinosaur",
                "pokemon",
                "big cat",
                "awwkitty"
            ]

            for (const fur of furries) {
                if (word.includes(fur)) return true;
            }

            return false;
        },

        highlight: (word: string) => {
            const highlights: Record<number, Highlight> = {};

            const furries = [
                "dragon",
                "feline",
                "canine",
                "rodent",
                "avian",
                "aquatic",
                "dinosaur",
                "pokemon",
                "big cat",
                "awwkitty"
            ]

            let furry: string = "dragon";
            let wordRef: string = word;

            for (const fur of furries) {
                if (word.includes(fur)) {
                    furry = fur;
                }
            }

            const replaceAt = (str: string, index: number, replacement: string): string => {
                return str.substring(0, index) + replacement + str.substring(index + 1);
            }

            for (let i = 0; i < furry.length; i++) {
                highlights[wordRef.indexOf(furry[i])] = {};
                wordRef = replaceAt(wordRef, i, '_');
            }

            return highlights;
        }
    },
    {
        id: 6,
        name: "palindrome",
        desc: "spelled the same way backwards and forwards",
        probability: 0.17,
        icon: "🪞",
        score: 123321,

        applicable: (word: string) => {
            const rev = word.toLowerCase().split('').reverse().join('');
            return word.toLowerCase() === rev;
        }
    },
    {
        id: 7,
        name: "short",
        desc: "less than 4 characters long",
        probability: 2.45,
        icon: "📏",
        score: 12400,

        applicable: (word: string) => word.length < 4
    },
    {
        id: 8,
        name: "long",
        desc: "more than 12 characters long",
        probability: 5.8,
        icon: "📏",
        score: 7800,

        applicable: (word: string) => word.length > 8
    }
    
]