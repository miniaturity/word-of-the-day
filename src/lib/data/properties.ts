import type { Property } from "$lib/types";

export const PROPERTIES: Property[] = [
    {
        name: "test",
        desc: "test",
        probability: 79,
        icon: "🪲",
        score: 400,

        applicable: (word: string) => {
            return true;
        },

        highlight: (word: string) => {
            return [
                
            ];
        }
    },
    {
        name: "test2",
        desc: "test",
        probability: 20,
        icon: "🪲",
        score: 400,

        applicable: (word: string) => {
            return true;
        },

        highlight: (word: string) => {
            return [
                
            ];
        }
    },
    {
        name: "test3",
        desc: "test",
        probability: 8,
        icon: "🪲",
        score: 400,

        applicable: (word: string) => {
            return true;
        },

        highlight: (word: string) => {
            return [
                
            ];
        }
    },
    {
        name: "test4",
        desc: "test",
        probability: 0.3,
        icon: "🪲",
        score: 400,

        applicable: (word: string) => {
            return true;
        },

        highlight: (word: string) => {
            return [
                
            ];
        }
    },
    {
        name: "tes123t2",
        desc: "test",
        probability: 0.05,
        icon: "🪲",
        score: 400,

        applicable: (word: string) => {
            return true;
        },

        highlight: (word: string) => {
            return [
                
            ];
        }
    },
    {
        name: "tes123t2",
        desc: "test",
        probability: 0.5,
        icon: "🪲",
        score: 400,

        applicable: (word: string) => {
            return true;
        },

        highlight: (word: string) => {
            return [
                
            ];
        }
    },
    {
        name: "tes112323t2",
        desc: "test",
        probability: 0.1,
        icon: "🪲",
        score: 400,

        applicable: (word: string) => {
            return true;
        },

        highlight: (word: string) => {
            return [
                
            ];
        }
    }
]