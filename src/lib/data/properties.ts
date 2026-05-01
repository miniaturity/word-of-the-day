import type { Property } from "$lib/types";

export const PROPERTIES: Property[] = [
    {
        id: 0,
        name: "pair",
        desc: "contains two of the same letter",
        probability: 25,
        icon: "🧑‍🤝‍🧑",
        score: 400,

        applicable: (word: string) => {
            return /(.).*\1/i.test(word);
        },

    
    }
    
]